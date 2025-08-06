# Visual Search Experiment - Function Flow Diagram

## Overview
This is a PsyToolkit-based visual search experiment implemented in HTML/JavaScript. The experiment presents visual stimuli (targets and distractors) and measures response times and accuracy.

## Function Categories and Flow

### 1. Initialization & Setup Functions

#### `whenloaded()`
- **Description**: Called when page loads
- **Purpose**: Initializes the experiment interface, enables start button, removes loading image
- **Flow**: Page Load → Interface Setup → Ready to Start

#### `main()`
- **Description**: Main experiment entry point
- **Purpose**: Sets up screen parameters, loads resources, starts experiment blocks
- **Flow**: Button Click → Screen Setup → Resource Loading → Block Execution

### 2. Resource Loading Functions

#### `psy_load_bitmap(url)`
- **Description**: Loads image resources for the experiment
- **Purpose**: Preloads all visual stimuli (targets, distractors, masks, etc.)

#### `psy_load_sound(url)`
- **Description**: Loads audio resources
- **Purpose**: Preloads sound files for feedback

#### `psy_load_font(name, size)`
- **Description**: Loads font resources
- **Purpose**: Sets up text rendering for instructions and feedback

### 3. Input Handling Functions

#### `psy_keyboard(expectedKey, timeout, correctStatus, incorrectStatus)`
- **Description**: Handles keyboard input detection
- **Purpose**: Captures spacebar responses during trials
- **Flow**: Stimulus Display → Key Detection → Response Recording

#### `getkeydown(event)` & `getkeyup(event)`
- **Description**: Low-level keyboard event handlers
- **Purpose**: Process raw keyboard events and trigger response evaluation

#### `getmouse_in_area(area)` & `getmouseclick_in_area(area)`
- **Description**: Mouse interaction detection
- **Purpose**: Handle mouse-based responses if needed

### 4. Visual Rendering Functions

#### `psy_draw_all_db()`
- **Description**: Main rendering function for all visual elements
- **Purpose**: Draws all active stimuli to the canvas using double buffering

#### `psy_add_centered_bitmap_db(bitmap, x, y)`
- **Description**: Adds a bitmap to the display buffer at specified coordinates
- **Purpose**: Places visual elements (targets, distractors, fixation point) on screen

#### `psy_add_text_rgb_db(text, x, y, font, r, g, b, size, style)`
- **Description**: Adds text elements to display
- **Purpose**: Shows instructions, feedback messages, and trial information

#### `psy_add_centered_rectangle_rgb_db(x, y, width, height, r, g, b)`
- **Description**: Draws colored rectangles
- **Purpose**: Creates backgrounds or highlight elements

### 5. Screen Management Functions

#### `psy_clear_screen_db()`
- **Description**: Clears the entire display buffer
- **Purpose**: Prepares screen for next stimulus presentation

#### `psy_clear_stimuli1(stimulusNumber)`
- **Description**: Removes specific stimulus from display
- **Purpose**: Controls which elements are visible during different trial phases

#### `psy_set_coordinate_system(system)`
- **Description**: Sets up coordinate system for stimulus placement
- **Purpose**: Defines how positions are calculated (center-based vs corner-based)

### 6. Timing & Control Functions

#### `psy_wait(bitmap, expectedKey)`
- **Description**: Waits for user input with optional visual stimulus
- **Purpose**: Controls trial flow and response collection

#### `psy_delay(milliseconds)`
- **Description**: Creates timed delays between trial events
- **Purpose**: Controls stimulus timing (ISI, mask duration, etc.)

#### `psy_diff_timers(start, end)`
- **Description**: Calculates time differences
- **Purpose**: Measures response times and trial durations

### 7. Randomization Functions

#### `psy_random(min, max)`
- **Description**: Generates random integers within range
- **Purpose**: Randomizes trial order and stimulus selection

#### `psy_random_weighted(weights, values)`
- **Description**: Weighted random selection
- **Purpose**: Biased stimulus selection if needed

#### `psy_random_from_array(array)`
- **Description**: Random selection from array
- **Purpose**: Pick random elements from predefined lists

### 8. Stimulus Selection Functions

#### `psy_choose(first, last, timeout)`
- **Description**: Multiple choice selection interface
- **Purpose**: Allows selection of multiple stimuli if needed

#### `psy_stimulus1()`
- **Description**: Stimulus container object
- **Purpose**: Manages individual stimulus properties and state

### 9. Trial Management Functions

#### `generaltype()` Constructor
- **Description**: Defines trial structure with stimulus parameters
- **Purpose**: Creates trial objects with target/distractor positions and properties
- **Parameters**: Trial number, target presence, set size, stimulus coordinates

### 10. Block & Task Control

#### `task_search`
- **Description**: Main experimental task controller
- **Key Methods**:
  - `start(trialSelection)`: Initializes task with trial selection method
  - `run()`: Executes trial steps in sequence
- **Purpose**: Controls the visual search trials through multiple phases:
  1. Trial selection and parameter setup
  2. Fixation point presentation
  3. Stimulus array presentation  
  4. Response collection
  5. Feedback presentation
  6. Mask presentation
  7. Inter-trial interval

#### `block_block1`
- **Description**: Experimental block controller
- **Purpose**: Manages series of trials, collects data, checks completion criteria

#### `block_messagenumber1`
- **Description**: Instruction block controller
- **Purpose**: Shows initial instructions before experiment begins

### 11. Data Management Functions

#### `addlog(message)`
- **Description**: Logs events for debugging
- **Purpose**: Records experimental events for troubleshooting

#### `addoutput(data)`
- **Description**: Saves trial data
- **Purpose**: Records response times, accuracy, and trial parameters

### 12. Utility Functions

#### `hexrgb(r, g, b)`
- **Description**: Converts RGB values to hex color codes
- **Purpose**: Color management for visual elements

#### `psy_mouse_visibility(visible)`
- **Description**: Controls mouse cursor visibility
- **Purpose**: Hides cursor during trials to avoid distraction

#### `Rectangle()`
- **Description**: Creates rectangle objects for collision detection
- **Purpose**: Defines clickable/hoverable areas

## Experiment Flow

```
Page Load
    ↓
whenloaded() → Interface Setup
    ↓
User Clicks Start
    ↓
main() → Screen Setup → Resource Loading
    ↓
blocks.run() → Block Sequence
    ↓
block_messagenumber1 → Instructions
    ↓
block_block1 → Main Experiment
    ↓
task_search → Individual Trials
    ↓
Trial Loop:
1. Parameter Selection (generaltype)
2. Fixation Point (500ms)
3. Blank Screen (400ms)  
4. Stimulus Array (search display)
5. Response Collection (spacebar)
6. Feedback Display
7. Mask Presentation
8. Data Recording
    ↓
Experiment Complete → Data Display
```

## Key Trial Phases (task_search.run())

1. **Setup Phase**: Select trial parameters from generaltype array
2. **Fixation Phase**: Present fixation cross (100ms)
3. **Blank Phase**: Clear screen (400ms)
4. **Stimulus Phase**: Present search array with targets/distractors
5. **Response Phase**: Wait for spacebar response
6. **Feedback Phase**: Show "There was none" or target location feedback
7. **Mask Phase**: Present visual masks (200ms total)
8. **Cleanup Phase**: Clear stimuli and record data
9. **ITI Phase**: Inter-trial interval (1000ms)

## Data Collection

- **Response Time**: Time from stimulus onset to keypress
- **Accuracy**: Correct detection of target presence/absence
- **Trial Parameters**: Set size, target presence, stimulus positions
- **Block Information**: Trial number, block number, experimental conditions

## Visual Stimuli

- **Target**: Specific visual element to be detected
- **Distractors**: Similar elements that should be ignored (distractor1, distractor2)
- **Fixation Point**: Central cross for gaze fixation
- **Masks**: Post-stimulus visual noise to prevent iconic memory
- **Feedback**: Text messages and visual indicators

This experiment appears to be a standard visual search paradigm measuring how quickly and accurately participants can detect targets among distractors across different set sizes.
