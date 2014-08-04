# tip

A tip... Not a tooltip. Just a tip, a triangle you can position on the page.

Why was it created?

Our control design has a message with a tip that points to an icon outside of the message element. We created the tip component

1) So we don't have to manually add markup for `tip`s each of our controls
2) So the tip can be part of the message but still positioned relative to the icon 

## Methods

### new Tip(options)

Create a new tip with the specified options.

 - `direction` - The tip direction e.g. `up`, `down`, `left`, `right`

### .show()

Show the tip.

### .hide()

Hide the tip.

### .direction(direction)

Set the direction e.g. `up`, `down`, `left`, `right`

### .position(x, y)

Set the top and left position in pixels.

### .positionAt(el, position)

Set the top and left position relative to an element.


 - `target` - The target element
 - `position` - The position relative to target element e.g. `top`, `bottom`, `left`, `right`




