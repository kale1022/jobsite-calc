import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Project, ResultLine, SavedItem, ShoppingLine } from '@/types';

const STORAGE_KEY = 'jobsitecalc.projects';

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

interface ProjectsValue {
  projects: Project[];
  createProject: (name: string) => Project;
  deleteProject: (projectId: string) => void;
  addItem: (
    projectId: string,
    item: Omit<SavedItem, 'id' | 'savedAt'>,
  ) => void;
  removeItem: (projectId: string, itemId: string) => void;
}

const ProjectsContext = createContext<ProjectsValue | null>(null);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const loaded = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setProjects(JSON.parse(raw));
        } catch {
          // Corrupt store — start fresh rather than crash.
        }
      }
      loaded.current = true;
    });
  }, []);

  useEffect(() => {
    if (loaded.current) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(projects)).catch(() => {});
    }
  }, [projects]);

  const createProject = useCallback((name: string): Project => {
    const project: Project = { id: makeId(), name: name.trim(), createdAt: Date.now(), items: [] };
    setProjects((prev) => [project, ...prev]);
    return project;
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  }, []);

  const addItem = useCallback(
    (projectId: string, item: Omit<SavedItem, 'id' | 'savedAt'>) => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? { ...p, items: [{ ...item, id: makeId(), savedAt: Date.now() }, ...p.items] }
            : p,
        ),
      );
    },
    [],
  );

  const removeItem = useCallback((projectId: string, itemId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, items: p.items.filter((i) => i.id !== itemId) } : p,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({ projects, createProject, deleteProject, addItem, removeItem }),
    [projects, createProject, deleteProject, addItem, removeItem],
  );

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}

export function useProjects(): ProjectsValue {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error('useProjects must be used within ProjectsProvider');
  return ctx;
}

/**
 * Merge every purchasable result line across a project's saved items into
 * one shopping list, summing quantities that share a label and unit.
 * Values look like "56", "~3.6 gal", "$160", "1.23 cu yd".
 */
export function aggregateShoppingList(items: SavedItem[]): ShoppingLine[] {
  const merged = new Map<string, ShoppingLine>();
  for (const item of items) {
    for (const line of item.results) {
      if (!(line.shop ?? false)) continue;
      const m = line.value.match(/^(~)?(\$)?([\d,]+(?:\.\d+)?)\s*(.*)$/);
      if (!m) continue;
      const [, approx, dollar, num, unitRaw] = m;
      const qty = parseFloat(num.replace(/,/g, ''));
      if (!Number.isFinite(qty)) continue;
      const unit = dollar ? 'USD' : unitRaw.trim();
      const key = `${line.label}|${unit}`;
      const existing = merged.get(key);
      if (existing) {
        existing.qty += qty;
        existing.approx = existing.approx || !!approx;
      } else {
        merged.set(key, { label: line.label, qty, unit, approx: !!approx });
      }
    }
  }
  return [...merged.values()];
}

/** Plain-text shopping list for sharing with a supplier or crew. */
export function shoppingListText(projectName: string, lines: ShoppingLine[]): string {
  const rows = lines.map((l) => {
    const qty = parseFloat(l.qty.toFixed(2));
    const amount = l.unit === 'USD' ? `$${qty}` : `${qty}${l.unit ? ` ${l.unit}` : ''}`;
    return `• ${l.label}: ${l.approx ? '~' : ''}${amount}`;
  });
  return `${projectName} — Shopping List\n${rows.join('\n')}\n\nBuilt with JobSite Calc`;
}
