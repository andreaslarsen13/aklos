# Timeless Color Palette

Complete color specification for the Timeless design system.

## Base Colors

### Backgrounds
```css
Window Background:     rgba(255, 255, 255, 0.7)   /* 70% white with 12px blur */
Menubar Background:    linear-gradient(
                         to bottom,
                         rgba(248, 248, 248, 0.85),
                         rgba(240, 240, 240, 0.85)
                       )
```

### Borders
```css
Window Border Active:   rgba(255, 255, 255, 0.3)   /* Soft white */
Window Border Inactive: rgba(200, 200, 200, 0.2)   /* Muted gray */
Menubar Border:         rgba(255, 255, 255, 0.2)   /* Subtle white */
```

## Title Bar

### Backgrounds
```css
Title Bar Active:       linear-gradient(
                          to bottom,
                          rgba(250, 250, 250, 0.8) 0%,
                          rgba(235, 235, 235, 0.75) 100%
                        )
Title Bar Inactive:     rgba(245, 245, 245, 0.6)
```

### Borders
```css
Title Bar Border:         rgba(255, 255, 255, 0.4)
Title Bar Border Inactive: rgba(255, 255, 255, 0.2)
Title Bar Border Bottom:   rgba(0, 0, 0, 0.08)
```

### Text
```css
Title Bar Text Active:    rgba(0, 0, 0, 0.9)    /* 90% black */
Title Bar Text Inactive:  rgba(0, 0, 0, 0.45)   /* 45% black */
```

## Buttons

### Glass Buttons
```css
Button Face:            rgba(255, 255, 255, 0.6)
Button Highlight:       rgba(255, 255, 255, 0.9)
Button Shadow:          rgba(0, 0, 0, 0.15)
Button Active Face:     rgba(240, 240, 240, 0.8)
```

### Primary Button (Timeless)
```css
Background:             rgba(100, 150, 255, 0.7)
Border:                 rgba(100, 150, 255, 0.3)
Text:                   #ffffff
Shadow:                 0 4px 12px rgba(100, 150, 255, 0.3),
                        0 2px 4px rgba(0, 0, 0, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3)

Hover:                  rgba(100, 150, 255, 0.85)
Hover Shadow:           0 6px 16px rgba(100, 150, 255, 0.4)
```

### Secondary Button (Timeless)
```css
Background:             rgba(255, 255, 255, 0.6)
Border:                 rgba(255, 255, 255, 0.3)
Text:                   rgba(0, 0, 0, 0.9)
Shadow:                 0 4px 12px rgba(0, 0, 0, 0.08),
                        0 2px 4px rgba(0, 0, 0, 0.05)

Hover:                  rgba(255, 255, 255, 0.75)
Hover Shadow:           0 6px 16px rgba(0, 0, 0, 0.1)
```

## Traffic Lights

### Colors (Softer than Aqua)
```css
Close:                  #FF6B6B    /* Coral red */
Close Hover:            #FF5252    /* Deeper coral */
Minimize:               #FFD93D    /* Sunny yellow */
Minimize Hover:         #FFC107    /* Golden yellow */
Maximize:               #6BCF7F    /* Fresh green */
Maximize Hover:         #4CAF50    /* Vibrant green */
```

## Selection & Accents

### Selection
```css
Selection Background:   rgba(100, 150, 255, 0.6)   /* Vibrant blue, 60% opacity */
Selection Text:         #ffffff                     /* Pure white */
Selection Glow:         rgba(100, 150, 255, 0.4)   /* Soft blue glow for focus rings */
```

## Text Hierarchy

### Text Colors
```css
Primary Text:           rgba(0, 0, 0, 0.9)    /* 90% black - high contrast */
Secondary Text:         rgba(0, 0, 0, 0.6)    /* 60% black - medium contrast */
Disabled Text:          rgba(0, 0, 0, 0.35)   /* 35% black - low contrast */
Menubar Text:           rgba(0, 0, 0, 0.9)    /* Same as primary */
```

## Shadows

### Window Shadows (Multi-layered)
```css
Window Shadow:          0 8px 32px rgba(0, 0, 0, 0.12),   /* Outer soft shadow */
                        0 2px 8px rgba(0, 0, 0, 0.08)      /* Inner subtle shadow */
```

### Component Shadows
```css
Glass Effect Shadow:    0 8px 32px rgba(0, 0, 0, 0.12),
                        0 2px 8px rgba(0, 0, 0, 0.08),
                        inset 0 1px 0 rgba(255, 255, 255, 0.5)

Glass Strong Shadow:    0 12px 48px rgba(0, 0, 0, 0.15),
                        0 4px 12px rgba(0, 0, 0, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.6)
```

## Pattern Overlays

### Pinstripe Patterns (Subtle Gradients)
```css
Title Bar:              linear-gradient(
                          to bottom,
                          rgba(255, 255, 255, 0.1) 0%,
                          rgba(255, 255, 255, 0.05) 50%,
                          rgba(0, 0, 0, 0.02) 100%
                        )

Window:                 linear-gradient(
                          to bottom,
                          rgba(255, 255, 255, 0.05) 0%,
                          rgba(255, 255, 255, 0.02) 100%
                        )

Menubar:                linear-gradient(
                          to bottom,
                          rgba(255, 255, 255, 0.15) 0%,
                          rgba(255, 255, 255, 0.05) 100%
                        )
```

## Glow Effects

### Timeless Glow (Animated Border)
```css
Gradient:               linear-gradient(
                          135deg,
                          rgba(100, 150, 255, 0.4),
                          rgba(150, 100, 255, 0.2)
                        )
Opacity Default:        0
Opacity Hover/Focus:    1
Transition:             opacity 0.3s ease
```

## Backdrop Blur Values

```css
Standard Blur:          blur(12px)    /* For windows, buttons, UI elements */
Strong Blur:            blur(20px)    /* For emphasized glass effects */
```

## Color Theory

### Philosophy
- **Translucency over opacity**: Everything uses rgba() with intentional alpha values
- **Layered depth**: Multiple soft shadows create 3D depth
- **Subtle contrast**: Borders and overlays use very low opacity (0.1-0.4)
- **Vibrant accents**: Selection and buttons use higher saturation with controlled opacity
- **Natural light**: White gradients simulate light refraction in glass

### Palette Notes
- All backgrounds are white-based with varying opacity (60-85%)
- Borders use white with low opacity for soft definition
- Text uses black with varying opacity for hierarchy
- Only selection and buttons introduce color (blue)
- Traffic lights are softer/lighter than Aqua's bold colors
- Shadows are exclusively black with very low opacity (8-15%)

## Accessibility

### Contrast Ratios
- **Primary Text** (90% black on 70% white): ~12:1 contrast ✓
- **Secondary Text** (60% black on 70% white): ~7:1 contrast ✓
- **Disabled Text** (35% black on 70% white): ~3:1 contrast ⚠️ (intentionally lower)

### Recommendations
- Always use primary text (90% black) for critical content
- Use secondary text (60% black) for supporting information
- Ensure backgrounds have sufficient blur to prevent content behind from reducing contrast
- Test on various wallpapers to ensure text remains readable

