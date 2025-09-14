//General purpose utilities (e.g. vector math, clampinng, interpolation, sorting)
import { Entity, Quaternion, TextGizmo, Vec3 } from 'horizon/core';

export function SetTextGizmoText(textGizmo: Entity | undefined, newText: string) {
  textGizmo?.as(TextGizmo)?.text.set(newText);
}

//region Math Calculations
export function vecDistance(v1: Vec3, v2: Vec3): number {
  return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2) + Math.pow(v1.z - v2.z, 2));
}

export function scaleVec3(v: Vec3, scale: number): Vec3 {
  return new Vec3(v.x * scale, v.y * scale, v.z * scale);
}

export function subtractVec3(v1: Vec3, v2: Vec3): Vec3 {
  return new Vec3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
}

export function addVec3(v1: Vec3, v2: Vec3): Vec3 {
  return new Vec3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
}

export function normalizeVec3(v: Vec3): Vec3 {
  const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  return length === 0 ? new Vec3(0, 0, 0) : new Vec3(v.x / length, v.y / length, v.z / length);
}

export function dotProductVec3(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function interpolate(
  inValue: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((inValue - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

export function randomRotation(): Quaternion {
  const x = Math.random() * 360;
  const y = Math.random() * 360;
  const z = Math.random() * 360;
  return Quaternion.fromEuler(new Vec3(x, y, z));
}

export function formatLargeNumber(num: number): string {
  if (isNaN(num)) return "0";
  const abs = Math.abs(num);
  const suffix = num < 0 ? "-" : "";
  if (abs >= 1e9) return `${suffix}${(abs / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${suffix}${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${suffix}${(abs / 1e3).toFixed(1)}K`;
  return num.toString();
}
