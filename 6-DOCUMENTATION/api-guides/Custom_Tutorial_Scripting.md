# Custom Tutorial Scripting

The **Custom Tutorial Scripting API** enables developers to create interactive tutorials for onboarding new players.  
It allows showing **info slides**, **button prompts**, and **toast notifications**.

---

## Tutorial APIs
- `showInfoSlides`  
- `showInputActionMessage`  
- `showToastMessage`  

---

## showInfoSlides

Displays a series of connected modal windows (slides).  
Can be used for:  
- Welcome messages  
- Instructions  
- Updates  

### Features
- Each slide can include:  
  - Title (localizable)  
  - Message (localizable)  
  - Image (texture asset, scaled to fit)  

**Image sizes:**  
- Header banner: **920x280 px**  
- Body image: **808x412 px**  

### Example
```ts
player.showInfoSlides([
  {
    title: 'Title Slide #1!',
    message: 'Image width: 920 height: 280',
    imageUri: 'YOUR_TEXTURE_ASSET_ID',
    style: { attachImageToHeader: true },
  },
  {
    title: '',
    message: 'Image width: 808 height: 412',
    imageUri: 'YOUR_TEXTURE_ASSET_ID',
  },
]);
```

---

## showInputActionMessage

Displays a **message above an on-screen button** with an animation.  
Useful for tooltips and prompts.

### Example
```ts
player.showInputActionMessage(
  PlayerInputAction.Jump,
  'Tap to do something cool!',
  5000, // duration in ms
);
```

---

## showToastMessage

Shows a **toast notification** at the top of the screen for a set duration.  

### Example
```ts
player.showToastMessage(
  'This is a custom announcement!',
  5000, // duration in ms
);
```

---
