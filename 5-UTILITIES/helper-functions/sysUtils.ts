import * as hz from 'horizon/core';

export function SetTextGizmoText(textGizmo: hz.Entity | undefined, newText: string) {
  textGizmo?.as(hz.TextGizmo)?.text.set(newText);
}
