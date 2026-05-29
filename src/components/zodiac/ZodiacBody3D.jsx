/**
 * ZodiacBody3D — Phase 1
 *
 * A rotating 3D metaphysical body. 36 organ-rows rendered as glowing spheres
 * positioned at rough anatomical heights, colored by macro-system
 * (Flow / Force / Fire / Breath / Structure / Signal). A translucent
 * stylized figure provides spatial reference. Mouse-drag rotates; idle
 * auto-rotates slowly.
 *
 * Phase 1 scope: figure + organ spheres + orbit + hover tooltip.
 * Phase 2: Grand Arc halo overhead with hover-to-isolate-system.
 * Phase 3: Drill-down camera zoom + inter-organ connection lines + 2D side panel.
 *
 * Data sources:
 *  - src/data/organCosmogram.js    (COSMOGRAM_ROWS, MACRO_SYSTEMS)
 *  - src/data/cosmogramUI.js       (COSMOGRAM_SYSTEM_UI for system id → hex color)
 *  - ORGAN_POSITIONS below         (y-height + angle + radius per row)
 */

import React, { Suspense, useRef, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { COSMOGRAM_ROWS, MACRO_SYSTEMS, QI_FLOW_EDGES, getUpstream, getDownstream, WU_XIN_ELEMENTS, ROW_ELEMENT, getTcmFlowEdges, getTcmPath, getKeRelationships } from '../../data/organCosmogram';
import { ORGAN_NARRATIVES } from '../../data/organNarratives';

// ─────────────────────────────────────────────────────────────────────────────
// Macro-system → hex color. Kept here (not in cosmogramUI.js) because r3f needs
// raw hex, not Tailwind classes.
// ─────────────────────────────────────────────────────────────────────────────
const SYSTEM_COLORS = {
  flow:      '#3b82f6', // blue
  force:     '#ef4444', // red
  fire:      '#f59e0b', // amber
  breath:    '#22d3ee', // cyan
  structure: '#a78bfa', // purple
  signal:    '#34d399', // emerald
};

// ─────────────────────────────────────────────────────────────────────────────
// Anatomical positions for each of the 36 rows. Stored as {y, angle, radius}
// and converted to {x, y, z} at render time.
//   y      — vertical height (−2 = feet, 0 = waist, +1.8 = top of head)
//   angle  — radians around the vertical axis (0 = front, PI = back)
//   radius — distance from central spine axis
// Positions are approximate/mythic, not surgically correct.
// ─────────────────────────────────────────────────────────────────────────────
const PI = Math.PI;

const ORGAN_POSITIONS = [
  // Flow (0–5) — muscles / bones / pelvis
  { row: 0,  y: -0.10, angle: 0,        radius: 0.22 }, // Smooth Muscle (core)
  { row: 1,  y: -0.45, angle:  PI / 2,  radius: 0.85 }, // Skeletal Muscle (arm/leg)
  { row: 2,  y: -0.85, angle: -PI / 2,  radius: 0.78 }, // Tendons (joint)
  { row: 3,  y:  0.60, angle: 0,        radius: 0.70 }, // Rib Cage (chest front)
  { row: 4,  y: -1.00, angle:  PI / 4,  radius: 0.50 }, // Femur (thigh)
  { row: 5,  y:  0.30, angle:  PI,      radius: 0.30 }, // Spinal Ribs (mid back)

  // Force (6–11) — nerves / heart
  { row: 6,  y:  1.00, angle:  PI / 4,  radius: 0.95 }, // Peripheral Nerves (shoulder)
  { row: 7,  y:  1.55, angle:  PI / 6,  radius: 0.38 }, // Synapses (head)
  { row: 8,  y:  0.85, angle: -PI / 8,  radius: 0.30 }, // Vagus Nerve (neck→gut)
  { row: 9,  y:  0.55, angle: -PI / 10, radius: 0.30 }, // SA Node (upper heart)
  { row: 10, y:  0.40, angle: -PI / 12, radius: 0.40 }, // Left Ventricle
  { row: 11, y:  0.40, angle:  PI / 12, radius: 0.40 }, // Right Ventricle

  // Fire (12–17) — digestive
  { row: 12, y:  0.10, angle:  PI / 10, radius: 0.42 }, // Hepatic Portal
  { row: 13, y:  0.05, angle:  PI / 6,  radius: 0.56 }, // Liver Core (right upper)
  { row: 14, y: -0.05, angle:  PI / 5,  radius: 0.54 }, // Bile Ducts
  { row: 15, y:  0.00, angle: -PI / 6,  radius: 0.54 }, // Stomach (left upper)
  { row: 16, y: -0.20, angle: 0,        radius: 0.32 }, // Small Intestine (center)
  { row: 17, y: -0.40, angle: 0,        radius: 0.56 }, // Large Intestine (frame)

  // Breath (18–23) — lungs / blood
  { row: 18, y:  0.90, angle:  PI / 4,  radius: 0.64 }, // Bronchioles
  { row: 19, y:  0.75, angle: -PI / 4,  radius: 0.78 }, // Lung Lobes
  { row: 20, y:  0.80, angle:  PI * 3 / 4, radius: 0.68 }, // Alveoli
  { row: 21, y:  0.30, angle: -PI * 3 / 4, radius: 0.85 }, // Plasma
  { row: 22, y:  0.10, angle:  PI / 2,  radius: 0.95 }, // Red Blood Cells
  { row: 23, y: -0.20, angle: -PI / 2,  radius: 0.95 }, // White Blood Cells

  // Structure (24–29) — diaphragm / spine
  { row: 24, y:  0.25, angle: 0,        radius: 0.36 }, // Lower Diaphragm
  { row: 25, y:  0.35, angle:  PI,      radius: 0.26 }, // Diaphragm Core (behind)
  { row: 26, y:  0.50, angle: 0,        radius: 0.40 }, // Upper Diaphragm
  { row: 27, y: -0.25, angle:  PI,      radius: 0.22 }, // Lumbar Spine
  { row: 28, y:  0.35, angle:  PI,      radius: 0.16 }, // Thoracic Spine
  { row: 29, y:  1.10, angle:  PI,      radius: 0.16 }, // Cervical Spine

  // Signal (30–35) — brain / lymph / immune
  { row: 30, y:  1.70, angle: 0,        radius: 0.32 }, // Prefrontal Cortex
  { row: 31, y:  1.80, angle:  PI / 4,  radius: 0.40 }, // Neocortex
  { row: 32, y:  1.65, angle:  PI / 2,  radius: 0.22 }, // Default Mode Network
  { row: 33, y:  0.95, angle:  PI / 3,  radius: 0.85 }, // Lymph Nodes (neck/armpit)
  { row: 34, y:  0.00, angle: -PI / 3,  radius: 1.00 }, // Lymph Fluid
  { row: 35, y:  1.30, angle: -PI / 4,  radius: 0.90 }, // Immune Signaling
];

function polarToCartesian({ y, angle, radius }) {
  return [Math.sin(angle) * radius, y, Math.cos(angle) * radius];
}

// ─────────────────────────────────────────────────────────────────────────────
// Stylized body silhouette — translucent, just for spatial reference.
// ─────────────────────────────────────────────────────────────────────────────
function BodySilhouette() {
  const mat = {
    transparent: true,
    opacity: 0.12,
    depthWrite: false,
    roughness: 0.3,
    metalness: 0.1,
    emissive: '#334155',
    emissiveIntensity: 0.3,
  };
  const col = '#cbd5e1';
  return (
    <group renderOrder={-1}>
      {/* Head */}
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.30, 24, 24]} />
        <meshStandardMaterial color={col} {...mat} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.30, 0]}>
        <cylinderGeometry args={[0.10, 0.12, 0.20, 16]} />
        <meshStandardMaterial color={col} {...mat} />
      </mesh>
      {/* Torso (tapered capsule) */}
      <mesh position={[0, 0.50, 0]}>
        <cylinderGeometry args={[0.48, 0.38, 1.40, 24]} />
        <meshStandardMaterial color={col} {...mat} />
      </mesh>
      {/* Pelvis */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.38, 0.32, 0.35, 20]} />
        <meshStandardMaterial color={col} {...mat} />
      </mesh>
      {/* Left leg */}
      <mesh position={[-0.18, -1.20, 0]}>
        <cylinderGeometry args={[0.14, 0.10, 1.50, 16]} />
        <meshStandardMaterial color={col} {...mat} />
      </mesh>
      {/* Right leg */}
      <mesh position={[0.18, -1.20, 0]}>
        <cylinderGeometry args={[0.14, 0.10, 1.50, 16]} />
        <meshStandardMaterial color={col} {...mat} />
      </mesh>
      {/* Left arm */}
      <mesh position={[-0.62, 0.55, 0]} rotation={[0, 0, Math.PI / 16]}>
        <cylinderGeometry args={[0.09, 0.07, 1.25, 16]} />
        <meshStandardMaterial color={col} {...mat} />
      </mesh>
      {/* Right arm */}
      <mesh position={[0.62, 0.55, 0]} rotation={[0, 0, -Math.PI / 16]}>
        <cylinderGeometry args={[0.09, 0.07, 1.25, 16]} />
        <meshStandardMaterial color={col} {...mat} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Single organ sphere. Glows in macro-system color; pulses gently; shows
// label tooltip on hover.
// ─────────────────────────────────────────────────────────────────────────────
function OrganSphere({ row, position, color, hovered, hoveredSystem, activeOrgan, personA, personB, showQiFlow, qiMode, onHover, onUnhover, onClick }) {
  const ref = useRef();
  // Subtle pulse to suggest "alive"
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const phase = row.row * 0.17;
    const scale = 1 + Math.sin(t * 1.2 + phase) * 0.04;
    ref.current.scale.setScalar(scale);
  });
  const isHovered = hovered === row.row;
  const isActive = activeOrgan === row.row;
  const isPersonA = personA === row.row;
  const isPersonB = personB === row.row;
  const isPerson = isPersonA || isPersonB;
  // Determine which organ rows are connected to the active organ
  const connectedToActive = useMemo(() => {
    if (activeOrgan == null) return null;
    const set = new Set();
    ALL_CONNECTIONS.forEach((c) => {
      if (c.a === activeOrgan) set.add(c.b);
      if (c.b === activeOrgan) set.add(c.a);
    });
    set.add(activeOrgan);
    return set;
  }, [activeOrgan]);
  // Isolation logic: activeOrgan > activeSystem > normal
  const inHoveredSystem = hoveredSystem && row.system === hoveredSystem;
  const outOfHoveredSystem = hoveredSystem && row.system !== hoveredSystem;
  const dimmedByOrgan = connectedToActive && !connectedToActive.has(row.row);
  const dimmedBySystem = !connectedToActive && outOfHoveredSystem;
  const boostedByOrgan = connectedToActive && connectedToActive.has(row.row) && !isActive;
  const emissiveIntensity = isActive
    ? 1.6
    : isPerson
      ? 1.3
      : isHovered
        ? 1.4
        : dimmedByOrgan
          ? 0.06
          : dimmedBySystem
            ? 0.08
            : boostedByOrgan
              ? 1.0
              : inHoveredSystem
                ? 1.1
                : 0.6;
  const materialOpacity = isPerson ? 1.0 : dimmedByOrgan ? 0.15 : dimmedBySystem ? 0.25 : 1.0;
  const sphereRadius = isActive ? 0.10 : isPerson ? 0.095 : isHovered ? 0.09 : boostedByOrgan ? 0.078 : inHoveredSystem ? 0.078 : 0.065;
  return (
    <group position={position}>
      <mesh
        ref={ref}
        onPointerOver={(e) => { e.stopPropagation(); onHover(row.row); }}
        onPointerOut={() => onUnhover()}
        onClick={(e) => { e.stopPropagation(); onClick(row.row); }}
      >
        <sphereGeometry args={[sphereRadius, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          roughness={0.3}
          metalness={0.2}
          transparent
          opacity={materialOpacity}
        />
      </mesh>
      {isPerson && (
        <mesh>
          <ringGeometry args={[0.11, 0.14, 32]} />
          <meshBasicMaterial
            color={isPersonA ? PERSON_COLORS.A : PERSON_COLORS.B}
            transparent
            opacity={0.5}
            side={2}
          />
        </mesh>
      )}
      {showQiFlow && qiMode === 'ke' && activeOrgan != null && activeOrgan !== row.row && (() => {
        const keRel = getKeRelationships(activeOrgan);
        const isControlled = keRel.controls.includes(row.row);
        const isController = keRel.controlledBy.includes(row.row);
        if (!isControlled && !isController) return null;
        return (
          <mesh>
            <ringGeometry args={[0.10, 0.13, 32]} />
            <meshBasicMaterial
              color={isControlled ? KE_CONTROL_COLOR : KE_CONTROLLED_COLOR}
              transparent
              opacity={0.6}
              side={2}
            />
          </mesh>
        );
      })()}
      {isHovered && (
        <Html
          position={[0, 0, 0]}
          style={{ pointerEvents: 'none' }}
          zIndexRange={[100, 0]}
        >
          <div style={{
            transform: 'translate(14px, -50%)',
            background: 'rgba(15, 23, 42, 0.94)',
            border: `1px solid ${color}`,
            borderRadius: 5,
            padding: '4px 7px',
            fontSize: 9,
            lineHeight: 1.3,
            color: '#e2e8f0',
            whiteSpace: 'nowrap',
            fontFamily: 'system-ui, sans-serif',
            boxShadow: `0 2px 8px rgba(0,0,0,0.5), 0 0 10px ${color}22`,
          }}>
            <div style={{ color, fontWeight: 700, fontSize: 10 }}>R{row.row} · {row.organ}</div>
            <div style={{ color: '#cbd5e1', fontSize: 9, marginTop: 1 }}>
              {ORGAN_NARRATIVES.find((n) => n.rowIndex === row.row)?.rowArchetype || ''}
            </div>
            <div style={{ color: '#94a3b8', fontSize: 8, marginTop: 1 }}>
              {row.mythicName} · {row.current}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Connection extraction — builds a deduplicated list of organ-pair connections
// from the 1,296-panel matrix (organNarratives.js). For each pair (i < j),
// takes the max of the two directional scores.
// ─────────────────────────────────────────────────────────────────────────────
const ALL_CONNECTIONS = (() => {
  const conns = [];
  const posMap = {};
  ORGAN_POSITIONS.forEach((p) => { posMap[p.row] = polarToCartesian(p); });
  const sysMap = {};
  COSMOGRAM_ROWS.forEach((r) => { sysMap[r.row] = r.system; });

  for (const row of ORGAN_NARRATIVES) {
    if (!row.complete || !row.panels) continue;
    for (const panel of row.panels) {
      const a = row.rowIndex;
      const b = panel.colIndex;
      if (a >= b) continue; // deduplicate: only store a < b
      const scoreAB = panel.hybridScore || 0;
      // find reverse score
      const revRow = ORGAN_NARRATIVES.find((r) => r.rowIndex === b);
      const revPanel = revRow?.panels?.find((p) => p.colIndex === a);
      const scoreBA = revPanel?.hybridScore || 0;
      const score = Math.max(scoreAB, scoreBA);
      const tier = score >= 100 ? 'SS' : score >= 95 ? 'S' : score >= 92 ? 'A' : score >= 90 ? 'B' : 'C';
      if (posMap[a] && posMap[b]) {
        conns.push({ a, b, score, tier, posA: posMap[a], posB: posMap[b], sysA: sysMap[a], sysB: sysMap[b] });
      }
    }
  }
  return conns;
})();

// ─────────────────────────────────────────────────────────────────────────────
// ConnectionLines — renders filtered lines between organ positions.
// ─────────────────────────────────────────────────────────────────────────────
function qiDirection(a, b) {
  const fwd = (b - a + 36) % 36;
  const bwd = (a - b + 36) % 36;
  return fwd <= bwd ? 1 : -1; // 1 = a feeds b, -1 = b feeds a
}

function ConnectionLine({ conn, showQi }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array([...conn.posA, ...conn.posB]);
    const colA = new THREE.Color(SYSTEM_COLORS[conn.sysA] || '#ffffff');
    const colB = new THREE.Color(SYSTEM_COLORS[conn.sysB] || '#ffffff');
    const colors = new Float32Array([colA.r, colA.g, colA.b, colB.r, colB.g, colB.b]);
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return g;
  }, [conn]);
  const alpha = 0.2 + (conn.score - 85) / 15 * 0.5;

  const arrow = useMemo(() => {
    if (!showQi) return null;
    const dir = qiDirection(conn.a, conn.b);
    const from = dir === 1 ? conn.posA : conn.posB;
    const to = dir === 1 ? conn.posB : conn.posA;
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const mid = a.clone().lerp(b, 0.55);
    const d = b.clone().sub(a).normalize();
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
    return { position: mid, quaternion: quat };
  }, [conn, showQi]);

  const arrowRef = useRef();
  useFrame((state) => {
    if (!arrowRef.current) return;
    const t = state.clock.elapsedTime;
    arrowRef.current.material.opacity = alpha * (0.5 + Math.sin(t * 2 + conn.a * 0.2) * 0.5);
  });

  return (
    <group>
      <line geometry={geo}>
        <lineBasicMaterial vertexColors transparent opacity={alpha} depthWrite={false} />
      </line>
      {arrow && (
        <mesh ref={arrowRef} position={arrow.position} quaternion={arrow.quaternion}>
          <coneGeometry args={[0.018, 0.055, 5]} />
          <meshBasicMaterial color="#34d399" transparent opacity={alpha} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

function ConnectionLines({ connections, showQi }) {
  if (!connections.length) return null;
  return (
    <group>
      {connections.map((c) => (
        <ConnectionLine key={`${c.a}-${c.b}`} conn={c} showQi={showQi} />
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Qi Flow visualization — pulsing directional lines along the 36-node cycle.
// When an organ is active, shows upstream (fading blue) and downstream (fading
// gold) paths. Arrows pulse in the flow direction.
// ─────────────────────────────────────────────────────────────────────────────
const QI_UPSTREAM_COLOR = '#60a5fa';  // blue
const QI_DOWNSTREAM_COLOR = '#fbbf24'; // gold
const QI_FULL_COLOR = '#34d399';       // emerald for full cycle

function QiFlowLine({ fromPos, toPos, color, opacity, pulsePhase }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.material.opacity = opacity * (0.6 + Math.sin(t * 3 + pulsePhase) * 0.4);
  });

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([...fromPos, ...toPos]), 3));
    return g;
  }, [fromPos, toPos]);

  return (
    <line ref={ref} geometry={geo}>
      <lineBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </line>
  );
}

function QiFlowArrow({ fromPos, toPos, color, opacity, pulsePhase }) {
  const { midpoint, quaternion } = useMemo(() => {
    const a = new THREE.Vector3(...fromPos);
    const b = new THREE.Vector3(...toPos);
    const mid = a.clone().lerp(b, 0.55);
    const dir = b.clone().sub(a).normalize();
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    return { midpoint: mid, quaternion: quat };
  }, [fromPos, toPos]);

  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.material.opacity = opacity * (0.5 + Math.sin(t * 3 + pulsePhase) * 0.5);
  });

  return (
    <mesh ref={ref} position={midpoint} quaternion={quaternion}>
      <coneGeometry args={[0.025, 0.07, 6]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}

function QiFlowLines({ activeOrgan, qiFlowDepth, posMap, qiMode }) {
  if (activeOrgan == null) return null;

  const paths = useMemo(() => {
    const lines = [];

    if (qiMode === 'tcm') {
      const downstream = getTcmPath(activeOrgan, qiFlowDepth, 'down');
      const upstream = getTcmPath(activeOrgan, qiFlowDepth, 'up');
      const tcmEdges = getTcmFlowEdges();
      const edgeSet = new Set(tcmEdges.map((e) => `${e.from}-${e.to}`));

      let prev = activeOrgan;
      downstream.forEach((node) => {
        const el = ROW_ELEMENT[node.row];
        const elColor = WU_XIN_ELEMENTS[el]?.color || QI_DOWNSTREAM_COLOR;
        const fade = 1 - (node.depth / qiFlowDepth) * 0.7;
        if (edgeSet.has(`${prev}-${node.row}`)) {
          lines.push({ from: prev, to: node.row, color: elColor, opacity: fade, phase: node.depth * 0.3, dir: 'down' });
        }
        prev = node.row;
      });

      prev = activeOrgan;
      upstream.forEach((node) => {
        const el = ROW_ELEMENT[node.row];
        const elColor = WU_XIN_ELEMENTS[el]?.color || QI_UPSTREAM_COLOR;
        const fade = 1 - (node.depth / qiFlowDepth) * 0.7;
        if (edgeSet.has(`${node.row}-${prev}`)) {
          lines.push({ from: node.row, to: prev, color: elColor, opacity: fade, phase: node.depth * 0.3, dir: 'up' });
        }
        prev = node.row;
      });
    } else {
      const upstream = getUpstream(activeOrgan, qiFlowDepth);
      const downstream = getDownstream(activeOrgan, qiFlowDepth);

      let prev = activeOrgan;
      downstream.forEach((row, i) => {
        const fade = 1 - (i / qiFlowDepth) * 0.8;
        lines.push({ from: prev, to: row, color: QI_DOWNSTREAM_COLOR, opacity: fade, phase: i * 0.3, dir: 'down' });
        prev = row;
      });

      prev = activeOrgan;
      upstream.forEach((row, i) => {
        const fade = 1 - (i / qiFlowDepth) * 0.8;
        lines.push({ from: row, to: prev, color: QI_UPSTREAM_COLOR, opacity: fade, phase: i * 0.3, dir: 'up' });
        prev = row;
      });
    }

    return lines;
  }, [activeOrgan, qiFlowDepth, qiMode]);

  return (
    <group>
      {paths.map((p, i) => {
        const fromXYZ = posMap[p.from];
        const toXYZ = posMap[p.to];
        if (!fromXYZ || !toXYZ) return null;
        return (
          <React.Fragment key={`${p.dir}-${i}`}>
            <QiFlowLine fromPos={fromXYZ} toPos={toXYZ} color={p.color} opacity={p.opacity} pulsePhase={p.phase} />
            <QiFlowArrow fromPos={fromXYZ} toPos={toXYZ} color={p.color} opacity={p.opacity} pulsePhase={p.phase} />
          </React.Fragment>
        );
      })}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// Ke (克) Control Flow — shows which organs the selected organ controls (red)
// and which organs control it (blue). Only active in 'ke' qiMode.
// ─────────────────────────────────────────────────────────────────────────────
const KE_CONTROL_COLOR = '#ef4444';   // red — "I restrain you"
const KE_CONTROLLED_COLOR = '#60a5fa'; // blue — "you restrain me"

function KeFlowLines({ activeOrgan, posMap }) {
  if (activeOrgan == null) return null;

  const { controls, controlledBy, element, targetElement, sourceElement } = useMemo(
    () => getKeRelationships(activeOrgan),
    [activeOrgan]
  );

  const activePos = posMap[activeOrgan];
  if (!activePos) return null;

  return (
    <group>
      {/* Lines TO organs this one controls (red) */}
      {controls.map((row, i) => {
        const pos = posMap[row];
        if (!pos) return null;
        return (
          <React.Fragment key={`ke-ctrl-${row}`}>
            <QiFlowLine fromPos={activePos} toPos={pos} color={KE_CONTROL_COLOR} opacity={0.7} pulsePhase={i * 0.2} />
            <QiFlowArrow fromPos={activePos} toPos={pos} color={KE_CONTROL_COLOR} opacity={0.7} pulsePhase={i * 0.2} />
          </React.Fragment>
        );
      })}
      {/* Lines FROM organs that control this one (blue) */}
      {controlledBy.map((row, i) => {
        const pos = posMap[row];
        if (!pos) return null;
        return (
          <React.Fragment key={`ke-by-${row}`}>
            <QiFlowLine fromPos={pos} toPos={activePos} color={KE_CONTROLLED_COLOR} opacity={0.5} pulsePhase={i * 0.2} />
            <QiFlowArrow fromPos={pos} toPos={activePos} color={KE_CONTROLLED_COLOR} opacity={0.5} pulsePhase={i * 0.2} />
          </React.Fragment>
        );
      })}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// A↔B connection beam — a glowing tube between two persons' organs.
// ─────────────────────────────────────────────────────────────────────────────
function ABConnectionBeam({ posA, posB, score }) {
  const meshRef = useRef();
  const glowRef = useRef();

  const { midpoint, length, quaternion } = useMemo(() => {
    const a = new THREE.Vector3(...posA);
    const b = new THREE.Vector3(...posB);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const len = a.distanceTo(b);
    const dir = b.clone().sub(a).normalize();
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    return { midpoint: mid, length: len, quaternion: quat };
  }, [posA, posB]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.15 + Math.sin(t * 2.5) * 0.08;
    }
  });

  return (
    <group position={midpoint} quaternion={quaternion}>
      {/* Core beam — gold→purple gradient via two halves */}
      <mesh ref={meshRef}>
        <cylinderGeometry args={[0.018, 0.018, length, 8]} />
        <meshBasicMaterial color={PERSON_COLORS.A} transparent opacity={0.95} depthWrite={false} />
      </mesh>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <cylinderGeometry args={[0.06, 0.06, length, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} depthWrite={false} />
      </mesh>
      {/* Score label at midpoint */}
      <Html position={[0, 0, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid #fbbf24',
          borderRadius: 4,
          padding: '2px 6px',
          fontSize: 10,
          fontWeight: 700,
          color: '#fbbf24',
          whiteSpace: 'nowrap',
          fontFamily: 'system-ui, sans-serif',
          boxShadow: '0 0 12px rgba(251,191,36,0.3)',
        }}>
          {score}
        </div>
      </Html>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Auto-rotating scene wrapper. Idles at ~0.3 rpm; drag to override.
// ─────────────────────────────────────────────────────────────────────────────
function Scene({ hovered, setHovered, activeSystem, activeOrgan, setActiveOrgan, connections, personA, personB, abConnection, showQiFlow, qiFlowDepth, qiMode, posMap }) {
  const organNodes = useMemo(() => {
    return COSMOGRAM_ROWS.map((row) => {
      const pos = ORGAN_POSITIONS.find((p) => p.row === row.row);
      if (!pos) return null;
      const xyz = polarToCartesian(pos);
      const color = SYSTEM_COLORS[row.system] || '#ffffff';
      return { row, xyz, color };
    }).filter(Boolean);
  }, []);

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, -3, -5]} intensity={0.6} color="#a78bfa" />
      <BodySilhouette />
      <ConnectionLines connections={connections} showQi={showQiFlow} />
      {showQiFlow && qiMode !== 'ke' && <QiFlowLines activeOrgan={activeOrgan} qiFlowDepth={qiFlowDepth} posMap={posMap} qiMode={qiMode === 'sheng' ? 'tcm' : 'mythic'} />}
      {showQiFlow && qiMode === 'ke' && <KeFlowLines activeOrgan={activeOrgan} posMap={posMap} />}
      {organNodes.map(({ row, xyz, color }) => (
        <OrganSphere
          key={row.row}
          row={row}
          position={xyz}
          color={row.row === personA ? PERSON_COLORS.A : row.row === personB ? PERSON_COLORS.B : color}
          hovered={hovered}
          hoveredSystem={activeSystem}
          activeOrgan={activeOrgan}
          personA={personA}
          personB={personB}
          showQiFlow={showQiFlow}
          qiMode={qiMode}
          onHover={setHovered}
          onUnhover={() => setHovered(null)}
          onClick={(rowIdx) => {
            setActiveOrgan((prev) => prev === rowIdx ? null : rowIdx);
            setShowConnections(true);
          }}
        />
      ))}
      {/* Glowing A↔B direct connection — tube mesh for visibility */}
      {abConnection && <ABConnectionBeam posA={abConnection.posA} posB={abConnection.posB} score={abConnection.score} />}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Top-level component. Canvas is fixed-height; Suspense covers the lazy
// three.js chunk while it streams in.
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// Organ Detail Panel — draggable, scrollable. Shows all connections from the
// selected organ, ranked by score (highest first), with mythic name, tier, and
// summary from the 1,296-panel matrix.
// ─────────────────────────────────────────────────────────────────────────────
function OrganDetailPanel({ activeOrgan, highlightOrgan, side = 'right', onClose, minimizedProp, onMinimizeChange }) {
  const panelRef = useRef(null);
  const dragState = useRef({ dragging: false, offsetX: 0, offsetY: 0 });
  const [pos, setPos] = useState(null);
  const [localMin, setLocalMin] = useState(false);
  const minimized = minimizedProp ?? localMin;
  const setMinimized = onMinimizeChange ?? setLocalMin;
  const lastSide = useRef(null);

  React.useLayoutEffect(() => {
    if (panelRef.current && (pos === null || lastSide.current !== side)) {
      const parent = panelRef.current.offsetParent || panelRef.current.parentElement;
      if (parent) {
        const pw = parent.clientWidth;
        setPos({ x: side === 'left' ? 5 : pw - 305, y: 35 });
      }
      lastSide.current = side;
    }
  });

  const onMouseDown = (e) => {
    if (e.target.closest('[data-no-drag]') || !pos) return;
    dragState.current = { dragging: true, offsetX: e.clientX - pos.x, offsetY: e.clientY - pos.y };
    e.preventDefault();
  };
  React.useEffect(() => {
    const onMove = (e) => {
      if (!dragState.current.dragging) return;
      setPos({ x: e.clientX - dragState.current.offsetX, y: e.clientY - dragState.current.offsetY });
    };
    const onUp = () => { dragState.current.dragging = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [pos?.x, pos?.y]);

  const organRow = COSMOGRAM_ROWS.find((r) => r.row === activeOrgan);
  const narRow = ORGAN_NARRATIVES.find((r) => r.rowIndex === activeOrgan);

  // Build connections list sorted by score (descending)
  const connections = useMemo(() => {
    if (!narRow?.panels) return [];
    return narRow.panels
      .filter((p) => p.colIndex !== activeOrgan)
      .map((p) => {
        const colRow = COSMOGRAM_ROWS.find((r) => r.row === p.colIndex);
        const colNar = ORGAN_NARRATIVES.find((r) => r.rowIndex === p.colIndex);
        return {
          colIndex: p.colIndex,
          organ: colRow?.organ || p.colOrgan,
          system: colRow?.system,
          archetype: colNar?.rowArchetype || '',
          mythicName: p.mythicName,
          score: p.hybridScore,
          tier: p.tier,
          summary: p.summary,
          feltSense: p.feltSense,
          attachment: p.attachment,
          stressResponse: p.stressResponse,
          cognitive: p.cognitive,
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [narRow, activeOrgan]);

  const [expandedIdx, setExpandedIdx] = useState(highlightOrgan ?? null);

  if (!organRow) return null;
  const color = SYSTEM_COLORS[organRow.system] || '#94a3b8';

  const tierColor = (t) => {
    if (t === 'SS') return '#fbbf24';
    if (t === 'S+' || t === 'S') return '#34d399';
    if (t === 'A') return '#60a5fa';
    if (t === 'B') return '#94a3b8';
    return '#64748b';
  };

  return (
    <div
      ref={panelRef}
      className="absolute z-50 select-none"
      style={{ left: pos ? pos.x : -999, top: pos ? pos.y : -999, width: 300 }}
    >
      {/* Drag handle / header — click to minimize/expand */}
      <div
        onMouseDown={onMouseDown}
        className={`cursor-move bg-slate-950/95 backdrop-blur border border-white/15 ${minimized ? 'rounded-lg' : 'rounded-t-lg'} px-3 py-2 flex items-center gap-2`}
      >
        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-bold text-white truncate">R{activeOrgan} · {organRow.organ}</div>
          <div className="text-[9px] text-white/70 truncate">{narRow?.rowArchetype || ''} · {organRow.mythicName} · {organRow.system}</div>
        </div>
        <button
          data-no-drag
          onClick={(e) => { e.stopPropagation(); setMinimized((v) => !v); }}
          className="text-white/30 hover:text-white/70 text-[10px] px-1"
          title={minimized ? 'Expand' : 'Minimize'}
        >
          {minimized ? '▸' : '▾'}
        </button>
        {onClose && (
          <button data-no-drag onClick={onClose} className="text-white/30 hover:text-red-400 text-xs px-1">✕</button>
        )}
      </div>

      {!minimized && (
        <>
          {/* Row identity */}
          {narRow && (
            <div data-no-drag className="bg-slate-900/95 backdrop-blur border-x border-white/10 px-3 py-2 text-[9px] text-white/70 space-y-0.5">
              <div><span className="text-white/50">Identity:</span> {narRow.rowIdentity}</div>
              {narRow.copilotNote && <div><span className="text-white/50">Note:</span> {narRow.copilotNote}</div>}
            </div>
          )}

          {/* Scrollable body */}
          <div
            data-no-drag
            className="bg-slate-950/92 backdrop-blur border border-t-0 border-white/10 rounded-b-lg overflow-y-auto"
            style={{ maxHeight: 420 }}
          >
        <div className="px-3 py-1.5 border-b border-white/5 text-[9px] text-white/40">
          {connections.length} connections · sorted by score · click to expand
        </div>
        {connections.map((c) => {
          const isExpanded = expandedIdx === c.colIndex;
          const isHighlighted = highlightOrgan != null && c.colIndex === highlightOrgan;
          return (
            <div
              key={c.colIndex}
              className={`px-3 py-1.5 border-b cursor-pointer transition-colors ${
                isHighlighted
                  ? 'bg-amber-500/15 border-amber-500/30'
                  : isExpanded
                    ? 'bg-white/5 border-white/5'
                    : 'border-white/5 hover:bg-white/[0.03]'
              }`}
              onClick={() => setExpandedIdx(isExpanded ? null : c.colIndex)}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: isHighlighted ? '#fbbf24' : SYSTEM_COLORS[c.system] }}
                />
                <span className="text-[10px] text-white font-semibold truncate">{c.organ} <span className="text-white/60">({c.archetype})</span></span>
                <span className="text-white/20 text-[8px]">{isExpanded ? '▾' : '▸'}</span>
                <span className="ml-auto text-[10px] font-mono font-bold" style={{ color: tierColor(c.tier) }}>
                  {c.score} {c.tier}
                </span>
              </div>
              <div className="text-[9px] text-white/70 mt-0.5 italic">"{c.mythicName}"</div>
              <div className={`text-[9px] text-white/60 mt-0.5 ${isExpanded ? '' : 'line-clamp-1'}`}>{c.summary}</div>

              {isExpanded && (
                <div className="mt-2 space-y-1.5 text-[9px] border-t border-white/5 pt-2">
                  {c.feltSense && (
                    <div>
                      <span className="text-cyan-300/70 font-semibold">Felt Sense</span>
                      <div className="text-white/70 mt-0.5">{c.feltSense}</div>
                    </div>
                  )}
                  {c.attachment && (
                    <div>
                      <span className="text-amber-300/70 font-semibold">Attachment Pattern</span>
                      <div className="text-white/70 mt-0.5">{c.attachment}</div>
                    </div>
                  )}
                  {c.stressResponse && (
                    <div>
                      <span className="text-red-300/70 font-semibold">Stress Response</span>
                      <div className="text-white/70 mt-0.5">{c.stressResponse}</div>
                    </div>
                  )}
                  {c.cognitive && (
                    <div>
                      <span className="text-purple-300/70 font-semibold">Cognitive Layer</span>
                      <div className="text-white/70 mt-0.5">{c.cognitive}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
        </>
      )}
    </div>
  );
}

// Legend order: top-down by anatomical height. Signal (head) → Force (nerves/heart)
// → Breath (lungs/blood) → Structure (diaphragm/spine) → Flow (muscles/bones) → Fire (digestive, last).
const LEGEND_ORDER = ['signal', 'force', 'breath', 'structure', 'flow', 'fire'];
const LEGEND_SYSTEMS = LEGEND_ORDER.map((id) => MACRO_SYSTEMS.find((s) => s.id === id));

const TIER_LABELS = ['SS', 'S', 'A', 'B'];

const PERSON_COLORS = { A: '#fbbf24', B: '#a78bfa' }; // gold, purple

export default function ZodiacBody3D({ personA = null, personB = null }) {
  const [hovered, setHovered] = useState(null);
  const [activeSystem, setActiveSystem] = useState(null);
  const [activeOrgan, setActiveOrgan] = useState(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showConnections, setShowConnections] = useState(false);
  const [panelAMin, setPanelAMin] = useState(false);
  const [panelBMin, setPanelBMin] = useState(false);
  const [showQiFlow, setShowQiFlow] = useState(false);
  const [qiFlowDepth, setQiFlowDepth] = useState(6);
  const [qiMode, setQiMode] = useState('mythic'); // 'mythic' | 'sheng' | 'ke'

  // Auto-select organ + show connections when a person is picked from the LAB
  const prevPersonA = useRef(personA);
  const prevPersonB = useRef(personB);
  React.useEffect(() => {
    if (personA != null && personA !== prevPersonA.current) {
      setActiveOrgan(personA);
      setShowConnections(true);
    }
    prevPersonA.current = personA;
  }, [personA]);
  React.useEffect(() => {
    if (personB != null && personB !== prevPersonB.current) {
      setActiveOrgan(personB);
      setShowConnections(true);
    }
    prevPersonB.current = personB;
  }, [personB]);
  const [scoreThreshold, setScoreThreshold] = useState(98);
  const [hiddenTiers, setHiddenTiers] = useState(new Set());

  const posMap = useMemo(() => {
    const m = {};
    ORGAN_POSITIONS.forEach((p) => { m[p.row] = polarToCartesian(p); });
    return m;
  }, []);

  // Direct A↔B connection (if both selected)
  const abConnection = useMemo(() => {
    if (personA == null || personB == null) return null;
    const a = Math.min(personA, personB);
    const b = Math.max(personA, personB);
    return ALL_CONNECTIONS.find((c) => c.a === a && c.b === b) || null;
  }, [personA, personB]);

  const toggleSystem = (id) => setActiveSystem((prev) => (prev === id ? null : id));
  const toggleTier = useCallback((tier) => {
    setHiddenTiers((prev) => {
      const next = new Set(prev);
      if (next.has(tier)) next.delete(tier); else next.add(tier);
      return next;
    });
  }, []);

  const filteredConnections = useMemo(() => {
    if (!showConnections) return [];
    return ALL_CONNECTIONS.filter((c) => {
      if (c.score < scoreThreshold) return false;
      if (hiddenTiers.has(c.tier)) return false;
      // Dual-person mode: show connections from expanded panels only
      if (personA != null && personB != null) {
        const fromA = !panelAMin && (c.a === personA || c.b === personA);
        const fromB = !panelBMin && (c.a === personB || c.b === personB);
        if (!fromA && !fromB) return false;
        return true;
      }
      if (activeOrgan != null && c.a !== activeOrgan && c.b !== activeOrgan) return false;
      if (activeOrgan == null && activeSystem && c.sysA !== activeSystem && c.sysB !== activeSystem) return false;
      return true;
    });
  }, [showConnections, scoreThreshold, hiddenTiers, activeSystem, activeOrgan, personA, personB, panelAMin, panelBMin]);

  return (
    <div className="relative w-full h-[560px] rounded-xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-white/10">
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center text-white/40 text-xs">
          Loading 3D scene…
        </div>
      }>
        <Canvas camera={{ position: [0, 0.3, 4.5], fov: 45 }}>
          <Scene
            hovered={hovered}
            setHovered={setHovered}
            activeSystem={activeSystem}
            activeOrgan={activeOrgan}
            setActiveOrgan={setActiveOrgan}
            connections={filteredConnections}
            personA={personA}
            personB={personB}
            abConnection={abConnection}
            showQiFlow={showQiFlow}
            qiFlowDepth={qiFlowDepth}
            qiMode={qiMode}
            posMap={posMap}
          />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={2.5}
            maxDistance={7}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
            autoRotate={autoRotate}
            autoRotateSpeed={0.4}
            target={[0, 0.3, 0]}
          />
        </Canvas>
      </Suspense>

      {/* Legend + Links — two-row bar, bottom center, narrow enough to not hide behind side panels */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-slate-950/85 backdrop-blur border border-white/10 rounded-lg px-2.5 py-1.5 text-[10px] text-white/70 z-10 max-w-[420px]">
        {/* Row 1: system dots */}
        <div className="flex items-center justify-center gap-0.5">
          {LEGEND_SYSTEMS.map((sys) => {
            const isActive = activeSystem === sys.id;
            const isDimmed = activeSystem && activeSystem !== sys.id;
            const color = SYSTEM_COLORS[sys.id];
            return (
              <button
                key={sys.id}
                onClick={() => toggleSystem(sys.id)}
                className={`flex items-center gap-0.5 rounded px-1 py-0.5 transition-all ${
                  isActive ? 'bg-white/10 ring-1 ring-white/20' : isDimmed ? 'opacity-30' : 'hover:bg-white/5'
                }`}
                title={`${sys.name} R${sys.rows[0]}–${sys.rows[sys.rows.length - 1]}`}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: color, boxShadow: isActive ? `0 0 6px ${color}` : 'none' }}
                />
                <span className={`text-[8px] ${isActive ? 'text-white font-semibold' : 'text-white/50'}`}>
                  {sys.name.replace('The ', '').replace(' System', '')}
                </span>
              </button>
            );
          })}
          {activeSystem && (
            <button onClick={() => setActiveSystem(null)} className="text-[8px] text-white/30 hover:text-white/60 px-0.5">✕</button>
          )}
        </div>
        {/* Row 2: auto rotate + links controls */}
        <div className="flex items-center justify-center gap-1.5 mt-1 pt-1 border-t border-white/10">
          <button
            onClick={() => setAutoRotate((v) => !v)}
            className={`px-1.5 py-0.5 rounded text-[8px] font-semibold transition-colors ${
              autoRotate
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-red-500/15 text-red-300 border border-red-500/30'
            }`}
          >
            {autoRotate ? 'Auto Rotate' : 'Stop'}
          </button>
          <div className="w-px h-3 bg-white/10" />
          <button
            onClick={() => setShowConnections((v) => !v)}
            className={`px-1.5 py-0.5 rounded text-[8px] font-semibold transition-colors ${
              showConnections
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-white/5 text-white/40 border border-white/10'
            }`}
          >
            Links {showConnections ? 'ON' : 'OFF'}
          </button>
          {showConnections && (
            <>
              <button
                onClick={() => setScoreThreshold((v) => Math.max(85, v - 1))}
                className="text-[9px] text-white/50 hover:text-white/90 font-bold px-0.5"
              >−</button>
              <span className="text-white/60 text-[9px] font-mono w-5 text-center">{scoreThreshold}</span>
              <button
                onClick={() => setScoreThreshold((v) => Math.min(100, v + 1))}
                className="text-[9px] text-white/50 hover:text-white/90 font-bold px-0.5"
              >+</button>
              {TIER_LABELS.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTier(t)}
                  className={`px-0.5 text-[8px] font-semibold ${hiddenTiers.has(t) ? 'text-white/20' : 'text-white/60'}`}
                >
                  {t}
                </button>
              ))}
              <span className="text-white/30 text-[7px]">{filteredConnections.length}</span>
            </>
          )}
          <div className="w-px h-3 bg-white/10" />
          {/* Qi Flow */}
          <button
            onClick={() => setShowQiFlow((v) => !v)}
            className={`px-1.5 py-0.5 rounded text-[8px] font-semibold transition-colors ${
              showQiFlow
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'bg-white/5 text-white/40 border border-white/10'
            }`}
          >
            Qi {showQiFlow ? 'ON' : 'OFF'}
          </button>
          {showQiFlow && (
            <>
              {['mythic', 'sheng', 'ke'].map((mode) => {
                const labels = { mythic: 'Mythic', sheng: '生 Sheng', ke: '克 Ke' };
                const activeColors = {
                  mythic: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
                  sheng: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
                  ke: 'bg-red-500/15 text-red-300 border-red-500/25',
                };
                return (
                  <button
                    key={mode}
                    onClick={() => setQiMode(mode)}
                    className={`px-1.5 py-0.5 rounded text-[8px] font-semibold transition-colors border ${
                      qiMode === mode ? activeColors[mode] : 'bg-white/5 text-white/30 border-white/10'
                    }`}
                  >
                    {labels[mode]}
                  </button>
                );
              })}
              <button
                onClick={() => setQiFlowDepth((v) => Math.max(1, v - 1))}
                className="text-[9px] text-white/50 hover:text-white/90 font-bold px-0.5"
              >−</button>
              <span className="text-cyan-300/70 text-[8px] font-mono w-4 text-center">{qiFlowDepth}</span>
              <button
                onClick={() => setQiFlowDepth((v) => Math.min(35, v + 1))}
                className="text-[9px] text-white/50 hover:text-white/90 font-bold px-0.5"
              >+</button>
            </>
          )}
        </div>
      </div>

      {/* Organ detail panels — A on left, B on right */}
      {personA != null && personB != null ? (
        <>
          <OrganDetailPanel activeOrgan={personA} highlightOrgan={personB} side="left" minimizedProp={panelAMin} onMinimizeChange={setPanelAMin} />
          <OrganDetailPanel activeOrgan={personB} highlightOrgan={personA} side="right" minimizedProp={panelBMin} onMinimizeChange={setPanelBMin} />
        </>
      ) : activeOrgan != null ? (
        <OrganDetailPanel
          activeOrgan={activeOrgan}
          highlightOrgan={personA != null ? personA : personB}
          side="right"
          onClose={() => setActiveOrgan(null)}
        />
      ) : null}

      {/* Hint — top right */}
      <div className="absolute top-2 right-2 text-[9px] text-white/30 z-10">
        drag to rotate · click an organ
      </div>
    </div>
  );
}
