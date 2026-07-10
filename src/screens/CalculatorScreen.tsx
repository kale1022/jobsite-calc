import React, { useEffect, useMemo, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { getCalculator } from '@/calculators';
import { AppButton, ResultCard, ScreenContainer, SegmentedControl, TextField } from '@/components';
import { CalcDiagram } from '@/diagrams';
import { useEntitlement } from '@/iap/useEntitlement';
import type { RootStackParamList } from '@/navigation/types';
import type { ResultLine } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Calculator'>;

function parseField(raw: string | undefined, optional: boolean, defaultValue: number): number | null {
  if (!raw || raw.trim() === '') {
    return optional ? defaultValue : null;
  }
  const n = parseFloat(raw.replace(',', '.'));
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

export function CalculatorScreen({ navigation, route }: Props) {
  const calc = getCalculator(route.params.calculatorId);
  const { isPremium } = useEntitlement();

  // Deep links can prefill inputs: jobsitecalc://calculator/concrete?length=10&width=10&depth=4
  const [inputs, setInputs] = useState<Record<string, string>>(() => {
    const params = route.params as unknown as Record<string, string | undefined>;
    const initial: Record<string, string> = {};
    for (const field of calc.fields) {
      const v = params[field.key];
      if (typeof v === 'string') initial[field.key] = v;
    }
    return initial;
  });
  const [selects, setSelects] = useState<Record<string, number>>(() =>
    Object.fromEntries((calc.selects ?? []).map((s) => [s.key, s.defaultValue])),
  );

  useEffect(() => {
    navigation.setOptions({ title: calc.title });
  }, [navigation, calc.title]);

  const computed: { values: Record<string, number>; results: ResultLine[] } | null =
    useMemo(() => {
      const values: Record<string, number> = { ...selects };
      for (const field of calc.fields) {
        const parsed = parseField(inputs[field.key], !!field.optional, field.defaultValue ?? 0);
        if (parsed === null) return null;
        values[field.key] = parsed;
      }
      // Required dimensions must be non-zero to produce a meaningful estimate.
      const requiredZero = calc.fields.some(
        (f) => !f.optional && (values[f.key] === 0 || Number.isNaN(values[f.key])),
      );
      if (requiredZero) return null;
      return { values, results: calc.compute(values) };
    }, [calc, inputs, selects]);

  return (
    <ScreenContainer scroll>
      {calc.fields.map((field) => (
        <TextField
          key={field.key}
          label={field.optional ? `${field.label} (optional)` : field.label}
          unit={field.unit}
          placeholder={field.placeholder}
          value={inputs[field.key] ?? ''}
          onChangeText={(text) => setInputs((prev) => ({ ...prev, [field.key]: text }))}
        />
      ))}
      {(calc.selects ?? []).map((select) => (
        <SegmentedControl
          key={select.key}
          label={select.label}
          options={select.options}
          value={selects[select.key]}
          onChange={(value) => setSelects((prev) => ({ ...prev, [select.key]: value }))}
        />
      ))}
      {computed ? (
        <>
          <ResultCard results={computed.results} note={calc.note} />
          <CalcDiagram calcId={calc.id} values={computed.values} />
          <AppButton
            title="Save to Project"
            variant="ghost"
            onPress={() => {
              if (!isPremium) {
                navigation.navigate('Paywall');
                return;
              }
              navigation.navigate('SaveToProject', {
                calcId: calc.id,
                calcTitle: calc.title,
                values: computed.values,
                results: computed.results,
              });
            }}
          />
        </>
      ) : null}
    </ScreenContainer>
  );
}
