# Qi Adjustment Pipeline — Mermaid Diagram

Paste this into any Mermaid-compatible renderer (GitHub, Notion, Mermaid Live Editor, etc.)

## Full Three-Pass Pipeline

```mermaid
flowchart TD
    ATFQ["ATFQ (60%)<br/>Natal Qi x 0.60"]
    ACYMFQ["ACYMFQ (40%)<br/>Transit Qi x 0.40"]

    ATFQ --> PassA["Pass A: Natal Internal Clashes 克<br/>Your elements fight each other<br/>Victim -10%, Attacker -2%"]
    ACYMFQ --> PassB["Pass B: Transit Internal Clashes 克<br/>Year/Month fight each other<br/>Victim -10%, Attacker -2%"]

    PassA --> PassC["Pass C: Transit → Natal 克<br/>Weather hits the car<br/>Natal victim -10% of transit<br/>Transit NOT reduced"]
    PassB -.->|transit attacks natal| PassC

    PassC -->|natal result| Recombine["Recombine<br/>Pass C natal + Pass B transit"]
    PassB -.->|transit result| Recombine

    Recombine --> Sheng["Step 7: Sheng Nourishment 生<br/>Parent feeds child +3%<br/>Capped at 20% of child<br/>Parent NOT drained"]

    Sheng --> Damping["Step 8: Universal Damping 耗<br/>All elements x 0.98<br/>Baseline friction"]

    Damping --> Transform["Step 9: Transformation 化<br/>If attacker >1.5 AND ratio >3:1<br/>30% of victim → child element"]

    Transform --> MFFQ["MFFQ<br/>Month Final Functional Qi"]

    MFFQ --> YongShen["Yong Shen 用神<br/>+ Stone/Crystal Rx"]

    style ATFQ fill:#1e3a5f,stroke:#3b82f6,color:#fff
    style ACYMFQ fill:#5f3a1e,stroke:#f59e0b,color:#fff
    style PassA fill:#3f1515,stroke:#ef4444,color:#fca5a5
    style PassB fill:#3f1515,stroke:#ef4444,color:#fca5a5
    style PassC fill:#5f0f0f,stroke:#dc2626,color:#fecaca
    style Recombine fill:#2d1b4e,stroke:#a855f7,color:#d8b4fe
    style Sheng fill:#0f3f1a,stroke:#22c55e,color:#86efac
    style Damping fill:#1f1f1f,stroke:#6b7280,color:#d1d5db
    style Transform fill:#3f2f0f,stroke:#eab308,color:#fde68a
    style MFFQ fill:#0f2f1f,stroke:#10b981,color:#6ee7b7
    style YongShen fill:#1a1a2e,stroke:#8b5cf6,color:#c4b5fd
```

## Simplified Linear Version

```mermaid
flowchart LR
    A[NTFQ<br/>60/40 Blend] --> B[Clash 克<br/>Three-Pass]
    B --> C[Sheng 生<br/>Nourishment]
    C --> D[Damping 耗<br/>x 0.98]
    D --> E[Transform 化<br/>Alchemy]
    E --> F[MFFQ<br/>Final Output]

    style A fill:#1e1e2e,stroke:#8b5cf6,color:#fff
    style B fill:#3f1515,stroke:#ef4444,color:#fca5a5
    style C fill:#0f3f1a,stroke:#22c55e,color:#86efac
    style D fill:#1f1f1f,stroke:#6b7280,color:#d1d5db
    style E fill:#3f2f0f,stroke:#eab308,color:#fde68a
    style F fill:#0f2f1f,stroke:#10b981,color:#6ee7b7
```

## Five Element Cycles

```mermaid
flowchart TD
    Wood((Wood 木)) -->|生 feeds| Fire((Fire 火))
    Fire -->|生 creates| Earth((Earth 土))
    Earth -->|生 bears| Metal((Metal 金))
    Metal -->|生 enriches| Water((Water 水))
    Water -->|生 nourishes| Wood

    Wood -.->|克 penetrates| Earth
    Earth -.->|克 dams| Water
    Water -.->|克 quenches| Fire
    Fire -.->|克 melts| Metal
    Metal -.->|克 chops| Wood

    style Wood fill:#0f3f1a,stroke:#22c55e,color:#86efac
    style Fire fill:#3f1515,stroke:#ef4444,color:#fca5a5
    style Earth fill:#3f2f0f,stroke:#f59e0b,color:#fde68a
    style Metal fill:#1f1f1f,stroke:#a1a1aa,color:#d1d5db
    style Water fill:#1e3a5f,stroke:#3b82f6,color:#93c5fd
```
