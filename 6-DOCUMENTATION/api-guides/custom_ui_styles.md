# Custom UI Styles

The available styles for customizing UI panels in your world are defined in the type aliases of the UI API, such as the ColorValue type. This topic describes the available style for each type.

---

## Type aliases:

### LayoutStyle
**API documentation:** LayoutStyle type alias.

| Name | Type | Description |
|------|------|-------------|
| display | Bindable<'none' \| 'flex'> | [Default: 'flex'] Works like CSS display but only supports 'none' and 'flex'. |
| height | Bindable<number \| string> | Similar to CSS height. Supports points and percentages only. |
| width | Bindable<number \| string> | Similar to CSS width. Supports points and percentages only. |
| bottom | number \| string | Similar to CSS bottom. Supports points and percentages only. |
| end | number \| string | Equivalent to right when direction is 'ltr', left when 'rtl'. |
| left | number \| string | Similar to CSS left. Supports points and percentages only. |
| right | number \| string | Similar to CSS right. Supports points and percentages only. |
| start | number \| string | Equivalent to left when 'ltr', right when 'rtl'. |
| top | number \| string | Similar to CSS top. Supports points and percentages only. |
| minWidth | number \| string | Similar to CSS min-width. Supports points and percentages only. |
| maxWidth | number \| string | Similar to CSS max-width. Supports points and percentages only. |
| minHeight | number \| string | Similar to CSS min-height. Supports points and percentages only. |
| maxHeight | number \| string | Similar to CSS max-height. Supports points and percentages only. |
| margin | number \| string | Same as setting all margins (top, left, bottom, right). |
| marginBottom | number \| string | Works like CSS margin-bottom. |
| marginEnd | number \| string | Equivalent to marginRight when 'ltr', marginLeft when 'rtl'. |
| marginHorizontal | number \| string | Sets both marginLeft and marginRight. |
| marginLeft | number \| string | Works like CSS margin-left. |
| marginRight | number \| string | Works like CSS margin-right. |
| marginStart | number \| string | Equivalent to marginLeft when 'ltr', marginRight when 'rtl'. |
| marginTop | number \| string | Works like CSS margin-top. |
| marginVertical | number \| string | Sets both marginTop and marginBottom. |
| padding | number \| string | Same as setting all paddings (top, bottom, left, right). |
| paddingBottom | number \| string | Works like CSS padding-bottom. |
| paddingEnd | number \| string | Equivalent to paddingRight when 'ltr', paddingLeft when 'rtl'. |
| paddingHorizontal | number \| string | Sets both paddingLeft and paddingRight. |
| paddingLeft | number \| string | Works like CSS padding-left. |
| paddingRight | number \| string | Works like CSS padding-right. |
| paddingStart | number \| string | Equivalent to paddingLeft when 'ltr', paddingRight when 'rtl'. |
| paddingTop | number \| string | Works like CSS padding-top. |
| paddingVertical | number \| string | Sets both paddingTop and paddingBottom. |
| position | 'absolute' \| 'relative' | [Default: 'relative']. Works like CSS positioning. |
| flexDirection | 'row' \| 'row-reverse' \| 'column' \| 'column-reverse' | [Default: 'column'] Controls stacking direction. |
| flexWrap | 'nowrap' \| 'wrap' \| 'wrap-reverse' | [Default: 'nowrap']. Works like CSS flex-wrap. |
| justifyContent | 'flex-start' \| 'flex-end' \| 'center' \| 'space-between' \| 'space-around' \| 'space-evenly' | [Default: 'flex-start']. Aligns children along the main axis. |
| alignContent | 'flex-start' \| 'flex-end' \| 'center' \| 'stretch' \| 'space-between' \| 'space-around' | [Default: 'flex-start']. Works like CSS align-content. |
| alignItems | 'flex-start' \| 'flex-end' \| 'center' \| 'stretch' \| 'baseline' | [Default: 'stretch']. Aligns children along the cross axis. |
| alignSelf | 'auto' \| 'flex-start' \| 'flex-end' \| 'center' \| 'stretch' \| 'baseline' | [Default: 'auto']. Overrides alignItems for the child. |
| overflow | 'visible' \| 'hidden' | [Default: 'visible']. Controls clipping of children. |
| flex | number | Behaves differently than CSS flex. Determines proportional sizing. |
| flexGrow | number | [Default: 0]. Works like CSS flex-grow. |
| flexShrink | number | [Default: 0]. Works like CSS flex-shrink. |
| flexBasis | number \| string | Works like CSS flex-basis. |
| aspectRatio | number | Controls aspect ratio of components. |
| zIndex | number | Works like CSS z-index. |
| layoutOrigin | [number, number] | [Default: [0,0]]. Defines origin for absolute positioning. |
| direction | 'inherit' \| 'ltr' \| 'rtl' | [Default: 'inherit']. Text/UI direction flow. |

---

### BorderStyle
**API documentation:** BorderStyle type alias.

| Name | Type | Description |
|------|------|-------------|
| borderColor | Bindable<ColorValue> | Works like CSS border-color. |
| borderRadius | number | Works like CSS border-radius. |
| borderBottomLeftRadius | number | Radius for bottom-left corner. |
| borderBottomRightRadius | number | Radius for bottom-right corner. |
| borderTopLeftRadius | number | Radius for top-left corner. |
| borderTopRightRadius | number | Radius for top-right corner. |
| borderWidth | Bindable<number> | Works like CSS border-width (points only). |
| borderBottomWidth | number | Works like CSS border-bottom-width. |
| borderEndWidth | number | Maps to borderRightWidth when 'ltr', borderLeftWidth when 'rtl'. |
| borderLeftWidth | number | Works like CSS border-left-width. |
| borderRightWidth | number | Works like CSS border-right-width. |
| borderStartWidth | number | Maps to borderLeftWidth when 'ltr', borderRightWidth when 'rtl'. |
| borderTopWidth | number | Works like CSS border-top-width. |

---

### ShadowStyle
**API documentation:** ShadowStyle type alias.

| Name | Type | Description |
|------|------|-------------|
| shadowColor | Bindable<ColorValue> | The drop color of the shadow. |
| shadowFalloff | 'linear' \| 'sqrt' \| 'sigmoid' | Shadow fading function. |
| shadowOffset | [number, number] | Offset in [x,y] pixels. |
| shadowOpacity | Bindable<number> | Opacity of shadow, 0.0 to 1.0. |
| shadowRadius | number | Blur radius. |
| shadowSpreadRadius | number | Expansion/shrink radius of shadow. |

---

### TransformStyle
**API documentation:** TransformStyle type alias.

| Name | Type | Description |
|------|------|-------------|
| transform | Array of transform objects | Supports rotate, scale, scaleX, scaleY, translate, skewX, skewY. |
| transformOrigin | [number \| string, number \| string] | [Default: ['50%','50%']]. Origin point for transforms. |

---

### ViewStyle
**API documentation:** ViewStyle type alias. Inherits LayoutStyle, BorderStyle, ShadowStyle, and TransformStyle.

| Name | Type | Description |
|------|------|-------------|
| backgroundColor | Bindable<ColorValue> | Background color. |
| backgroundClip | 'border-box' \| 'padding-box' | [Default: 'border-box']. Controls background rendering. |
| opacity | Bindable<number> | Opacity, 0.0 to 1.0. |
| gradientColorA | Bindable<ColorValue> | Starting gradient color. |
| gradientColorB | Bindable<ColorValue> | Ending gradient color. |
| gradientXa | number \| string | Gradient start x-pos. |
| gradientYa | number \| string | Gradient start y-pos. |
| gradientXb | number \| string | Gradient end x-pos. |
| gradientYb | number \| string | Gradient end y-pos. |
| gradientAngle | string | Gradient direction, e.g. '0deg'. |

---

### TextStyle
**API documentation:** TextStyle type alias. Inherits ViewStyle.

| Name | Type | Description |
|------|------|-------------|
| color | Bindable<ColorValue> | [Default: 'white']. Text color. |
| fontFamily | string | [Default: 'Roboto']. Limited set of custom fonts. |
| fontSize | Bindable<number> | [Default: 20]. Font size. |
| fontWeight | Bindable<'normal'\|'bold'\|'100'...'900'> | [Default: 'normal']. Font weight. |
| letterSpacing | number | Character spacing. |
| lineHeight | number | Line height. |
| textAlign | 'auto'\|'left'\|'right'\|'center' | Text alignment. |
| textAlignVertical | 'auto'\|'top'\|'bottom'\|'center' | Vertical alignment. |
| textDecorationLine | Bindable<'none'\|'underline'\|'line-through'\|'underline line-through'> | Text decoration. |
| textShadowColor | Bindable<ColorValue> | Shadow color. |
| textShadowOffset | [number, number] | Shadow offset. |
| textShadowRadius | number | Blur radius of shadow. |
| whiteSpace | 'normal'\|'pre-line'\|'pre-wrap' | Text wrapping/spacing. |

**Available Fonts:**  
- Anton: 'normal'/'400'  
- Bangers: 'normal'/'400'  
- Kallisto: 'bold'/'700'  
- Optimistic: 'normal'/'400', '500', 'bold'/'700'  
- Oswald: 'normal'/'400'  
- Roboto: '100', '300', '400', '500', '700', '900'  
- Roboto-Mono: '400', '500', '700'  

---

### ImageStyle
**API documentation:** ImageStyle. Inherits ViewStyle.

| Name | Type | Description |
|------|------|-------------|
| resizeMode | 'cover'\|'contain'\|'stretch'\|'center'\|'repeat' | [Default: 'cover']. Defines how images resize. |
| tintColor | Bindable<ColorValue> | Changes the color of all the non-transparent pixels to the tintColor. |
| tintOperation | 'replace'\|'multiply' | Changes how the tint color is applied to the original image source. |

