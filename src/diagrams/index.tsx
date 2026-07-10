import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { colors, fontSize, radius, spacing } from '@/theme';
import { fmt } from '@/calculators/format';

interface DiagramProps {
  calcId: string;
  values: Record<string, number>;
}

const STROKE = colors.border;
const ACCENT = colors.primary;
const LABEL = colors.textMuted;
const FILL = colors.surfaceAlt;

/** Clamp an aspect ratio so extreme inputs still draw a readable shape. */
function aspect(w: number, h: number, min = 0.35, max = 2.2): number {
  if (w <= 0 || h <= 0) return 1;
  return Math.min(max, Math.max(min, h / w));
}

function DimText({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <SvgText x={x} y={y} fill={LABEL} fontSize="11" textAnchor="middle">
      {children}
    </SvgText>
  );
}

/** Top-down / elevation rectangle with width + height dimension labels. */
function PlanRect({
  width,
  wFt,
  hFt,
  wLabel,
  hLabel,
  chip,
  children,
}: {
  width: number;
  wFt: number;
  hFt: number;
  wLabel: string;
  hLabel: string;
  chip?: string;
  children?: (box: { x: number; y: number; w: number; h: number }) => React.ReactNode;
}) {
  const pad = 30;
  const w = width - pad * 2;
  const h = w * aspect(wFt, hFt);
  const svgH = h + pad * 2;
  const box = { x: pad, y: pad, w, h };
  return (
    <View>
      <Svg width={width} height={svgH}>
        <Rect
          x={box.x}
          y={box.y}
          width={box.w}
          height={box.h}
          fill={FILL}
          stroke={STROKE}
          strokeWidth={1.5}
          rx={3}
        />
        {children?.(box)}
        {/* top dimension */}
        <Line x1={box.x} y1={16} x2={box.x + box.w} y2={16} stroke={LABEL} strokeWidth={1} />
        <Line x1={box.x} y1={12} x2={box.x} y2={20} stroke={LABEL} strokeWidth={1} />
        <Line x1={box.x + box.w} y1={12} x2={box.x + box.w} y2={20} stroke={LABEL} strokeWidth={1} />
        <SvgText x={box.x + box.w / 2} y={12} fill={LABEL} fontSize="11" textAnchor="middle">
          {wLabel}
        </SvgText>
        {/* left dimension */}
        <Line x1={16} y1={box.y} x2={16} y2={box.y + box.h} stroke={LABEL} strokeWidth={1} />
        <Line x1={12} y1={box.y} x2={20} y2={box.y} stroke={LABEL} strokeWidth={1} />
        <Line x1={12} y1={box.y + box.h} x2={20} y2={box.y + box.h} stroke={LABEL} strokeWidth={1} />
        <SvgText
          x={10}
          y={box.y + box.h / 2}
          fill={LABEL}
          fontSize="11"
          textAnchor="middle"
          transform={`rotate(-90, 10, ${box.y + box.h / 2})`}
        >
          {hLabel}
        </SvgText>
      </Svg>
      {chip ? (
        <View style={styles.chip}>
          <Text style={styles.chipText}>{chip}</Text>
        </View>
      ) : null}
    </View>
  );
}

function FramingDiagram({ width, values }: { width: number; values: Record<string, number> }) {
  const pad = 30;
  const w = width - pad * 2;
  const h = 120;
  const studCount = Math.ceil((values.length * 12) / values.spacing) + 1;
  const gap = w / Math.max(1, studCount - 1);
  return (
    <Svg width={width} height={h + pad + 16}>
      {/* plates */}
      <Rect x={pad} y={20} width={w} height={8} fill={ACCENT} rx={1} />
      <Rect x={pad} y={20 + h} width={w} height={8} fill={ACCENT} rx={1} />
      {/* studs */}
      {Array.from({ length: studCount }, (_, i) => (
        <Rect
          key={i}
          x={pad + Math.min(i * gap, w - 5)}
          y={28}
          width={5}
          height={h - 8}
          fill={FILL}
          stroke={STROKE}
          strokeWidth={1}
        />
      ))}
      <DimText x={width / 2} y={h + pad + 10}>
        {`${fmt(values.length)} ft — ${studCount} studs @ ${values.spacing}" OC`}
      </DimText>
    </Svg>
  );
}

function SheetGridDiagram({
  width,
  wallFt,
  heightFt,
  sheetWFt,
  sheetHFt,
}: {
  width: number;
  wallFt: number;
  heightFt: number;
  sheetWFt: number;
  sheetHFt: number;
}) {
  const pad = 30;
  const w = width - pad * 2;
  const h = w * aspect(wallFt, heightFt, 0.25, 1.2);
  const pxPerFtX = w / wallFt;
  const pxPerFtY = h / heightFt;
  const vLines = [];
  for (let ft = sheetWFt; ft < wallFt; ft += sheetWFt) {
    vLines.push(pad + ft * pxPerFtX);
  }
  const hLines = [];
  for (let ft = sheetHFt; ft < heightFt; ft += sheetHFt) {
    hLines.push(pad + ft * pxPerFtY);
  }
  return (
    <Svg width={width} height={h + pad * 2}>
      <Rect x={pad} y={pad} width={w} height={h} fill={FILL} stroke={STROKE} strokeWidth={1.5} />
      {vLines.map((x, i) => (
        <Line key={`v${i}`} x1={x} y1={pad} x2={x} y2={pad + h} stroke={ACCENT} strokeWidth={1} strokeDasharray="4,3" />
      ))}
      {hLines.map((y, i) => (
        <Line key={`h${i}`} x1={pad} y1={y} x2={pad + w} y2={y} stroke={ACCENT} strokeWidth={1} strokeDasharray="4,3" />
      ))}
      <DimText x={width / 2} y={14}>{`${fmt(wallFt)} ft × ${fmt(heightFt)} ft`}</DimText>
    </Svg>
  );
}

function RoofDiagram({ width, values }: { width: number; values: Record<string, number> }) {
  const pad = 30;
  const w = width - pad * 2;
  const h = 90;
  const ridgeX = width / 2;
  return (
    <Svg width={width} height={h + pad + 20}>
      <Path
        d={`M ${pad} ${h + pad} L ${ridgeX} ${pad} L ${width - pad} ${h + pad} Z`}
        fill={FILL}
        stroke={STROKE}
        strokeWidth={1.5}
      />
      <Line x1={pad + 14} y1={h + pad - 8} x2={ridgeX} y2={pad + 8} stroke={ACCENT} strokeWidth={1.5} strokeDasharray="5,4" />
      <DimText x={width / 2} y={h + pad + 14}>
        {`${fmt(values.area)} sq ft sloped plane`}
      </DimText>
    </Svg>
  );
}

export function CalcDiagram({ calcId, values }: DiagramProps) {
  const { width: screenW } = useWindowDimensions();
  const width = Math.min(screenW - spacing.lg * 2 - spacing.lg * 2, 480);

  let body: React.ReactNode = null;
  switch (calcId) {
    case 'concrete':
      body = (
        <PlanRect
          width={width}
          wFt={values.length}
          hFt={values.width}
          wLabel={`${fmt(values.length)} ft`}
          hLabel={`${fmt(values.width)} ft`}
          chip={`${fmt(values.depth)}" deep`}
        />
      );
      break;
    case 'mulch':
      body = (
        <PlanRect
          width={width}
          wFt={values.length}
          hFt={values.width}
          wLabel={`${fmt(values.length)} ft`}
          hLabel={`${fmt(values.width)} ft`}
          chip={`${fmt(values.depth)}" deep`}
        />
      );
      break;
    case 'paint':
      body = (
        <PlanRect
          width={width}
          wFt={values.perimeter}
          hFt={values.height}
          wLabel={`${fmt(values.perimeter)} ft total`}
          hLabel={`${fmt(values.height)} ft`}
          chip={`${fmt(values.coats, 0)} coat${values.coats === 1 ? '' : 's'}`}
        />
      );
      break;
    case 'boardFeet':
      body = (
        <PlanRect
          width={width}
          wFt={values.length * 12}
          hFt={values.width}
          wLabel={`${fmt(values.length)} ft`}
          hLabel={`${fmt(values.width)}"`}
          chip={`${fmt(values.thickness)}" thick × ${fmt(values.qty, 0)} pcs`}
        />
      );
      break;
    case 'framing':
      body = <FramingDiagram width={width} values={values} />;
      break;
    case 'drywall':
      body = (
        <SheetGridDiagram
          width={width}
          wallFt={values.perimeter}
          heightFt={values.height}
          sheetWFt={values.sheetSqFt === 48 ? 12 : 8}
          sheetHFt={4}
        />
      );
      break;
    case 'tile':
      body = (
        <SheetGridDiagram
          width={width}
          wallFt={values.length}
          heightFt={values.width}
          sheetWFt={values.tileW / 12}
          sheetHFt={values.tileH / 12}
        />
      );
      break;
    case 'roofing':
      body = <RoofDiagram width={width} values={values} />;
      break;
    default:
      return null;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.label}>PREVIEW</Text>
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    color: colors.textFaint,
    fontSize: fontSize.xs,
    letterSpacing: 1.2,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  chip: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  chipText: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
});
