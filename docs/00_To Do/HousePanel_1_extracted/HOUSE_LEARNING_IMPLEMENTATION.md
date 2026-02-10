# House Learning Panel - Implementation Guide

## Overview
Floating, draggable modal that appears when user clicks a house on the wheel.
- 50% page width
- Movable over the wheel
- Tabbed interface (Tab 0 + 12 house tabs)
- Scrollable content area

## Component Structure

```typescript
// HouseLearningPanel.tsx
interface Props {
  houseNumber: number; // 0-12 (0 = "What Are Houses")
  onClose: () => void;
  chartData?: any; // For future personalization
}

// State
- activeTab: number
- position: { x, y }
- isDragging: boolean
- dragOffset: { x, y }
```

## Layout Structure

```
┌────────────────────────────────────────────────┐
│ [Move Icon] Western Zodiac House Learning  [X]│ ← Draggable header
├────────────────────────────────────────────────┤
│ [Tab0] [H1] [H2] [H3] ... [H12]              │ ← Tab navigation
├────────────────────────────────────────────────┤
│                                                 │
│                                                 │
│           SCROLLABLE CONTENT AREA              │
│           (Tab content renders here)           │
│                                                 │
│                                                 │
├────────────────────────────────────────────────┤
│ 💡 Tip: Drag this panel to see the wheel      │ ← Footer tip
└────────────────────────────────────────────────┘
```

## Dragging Logic

```typescript
const handleMouseDown = (e: React.MouseEvent) => {
  const rect = panelRef.current.getBoundingClientRect();
  setDragOffset({
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  });
  setIsDragging(true);
};

useEffect(() => {
  if (isDragging) {
    const handleMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    };
    const handleUp = () => setIsDragging(false);
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }
}, [isDragging, dragOffset]);
```

## Tab 0 Content Structure

### Sections (All Collapsible)
1. **Opening Hook** - "What Are Houses?"
2. **Key Distinction** - Planets vs Houses
3. **How Calculated** - ASC explanation
4. **Four Angles** - ASC/IC/DSC/MC
5. **House Flow** - Counterclockwise + 4 quadrants
6. **Why Different Sizes** - Size doesn't matter
7. **House Rulers** - Power source concept
8. **Sign Rulers Table** - Modern rulerships
9. **Why Rulers Matter** - 3 examples
10. **Complete Picture** - Baking cake analogy
11. **Next Steps** - Navigate to house tabs

### Content Pattern
```typescript
<section>
  <h2>Section Title</h2>
  <div className="5W+H grid">
    Who: ...
    What: ...
    When: ...
    Where: ...
    Why: ...
    How: ...
    Emotion: ...
  </div>
  <ExampleBox>Real example</ExampleBox>
</section>
```

## Tab 1-12 Content Structure

### Sections (Per House)
1. **Header** - House name + subtitle
2. **What This House Governs** - Life areas list
3. **Who Can Rule** - 12 sign possibilities table
4. **Power Flow Architecture** - All 12 variations (collapsible)
5. **Planets in House** - 10-12 planet meanings (collapsible)
6. **How to Read** - 6-step guide
7. **Example Synthesis** - Complete reading example

### Power Flow Card Pattern
```typescript
<CollapsibleCard>
  <Header>
    H1 → H5: Identity Through Creativity
    Flow: H1 → H5
  </Header>
  <ExpandedContent>
    - Example chart
    - 5W+H+Emotion breakdown
    - Characteristics list
    - Challenges list
    - Gifts list
    - Real-world example
  </ExpandedContent>
</CollapsibleCard>
```

## Styling Guidelines

### Colors
- Background: slate-900
- Border: cyan-500 (2px)
- Headers: cyan-400
- Accent1: purple-400 (rulers, power flow)
- Accent2: yellow-400 (warnings, examples)
- Text: white (headings), slate-300 (body)

### Typography
- Title: text-3xl font-bold
- Section: text-2xl font-bold
- Subsection: text-xl font-semibold
- Body: text-base
- Small: text-sm

### Spacing
- Section gap: space-y-8
- Content gap: space-y-4
- Card padding: p-6
- Border radius: rounded-lg

## Integration with Main App

```typescript
// In main chart component
const [learningPanelOpen, setLearningPanelOpen] = useState(false);
const [selectedHouse, setSelectedHouse] = useState(0);

// When user clicks house on wheel
const handleHouseClick = (houseNumber: number) => {
  setSelectedHouse(houseNumber);
  setLearningPanelOpen(true);
};

// Render
{learningPanelOpen && (
  <HouseLearningPanel
    houseNumber={selectedHouse}
    onClose={() => setLearningPanelOpen(false)}
    chartData={userChartData}
  />
)}
```

## Data Structure for Content

```typescript
// HOUSE_DATA.ts
export const HOUSE_CONTENT = {
  0: { /* Tab 0 content */ },
  1: {
    title: "House 1 - The Self",
    subtitle: "Your First Impression & Identity",
    lifeAreas: [
      "Physical appearance and body",
      "Personality and temperament",
      // ... 6 more
    ],
    powerFlows: {
      1: { /* H1→H1 data */ },
      2: { /* H1→H2 data */ },
      // ... through 12
    },
    planets: {
      Sun: { /* Sun in H1 data */ },
      Moon: { /* Moon in H1 data */ },
      // ... 10 more
    }
  },
  // ... houses 2-12
};
```

## Next Steps for Implementation

1. ✅ Create HouseLearningPanel.tsx shell
2. ✅ Implement dragging logic
3. ✅ Build tab navigation
4. ✅ Create Tab 0 complete content
5. ✅ Create Tab 1 structure
6. ⏳ Create HOUSE_DATA.ts with all content
7. ⏳ Build collapsible components
8. ⏳ Implement tabs 2-12
9. ⏳ Add responsive mobile design
10. ⏳ Connect to actual chart data

## File Delivered

See: `HouseLearningPanel_Complete.tsx`
- Tab 0: Fully implemented with all sections
- Tab 1: Structure complete, needs data population
- Tabs 2-12: Placeholder structure

Next: Refine Tab 0/1, then replicate pattern for remaining houses.
