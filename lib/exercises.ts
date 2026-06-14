import { Exercise } from './types';

export const EXERCISES: Omit<Exercise, 'id' | 'is_custom' | 'created_by_user_id'>[] = [
  // CHEST
  { name: 'Barbell Bench Press', muscle_group: 'Chest', secondary_muscles: ['Triceps', 'Shoulders'], equipment: 'Barbell', form_tip: 'Keep shoulder blades retracted and feet flat on floor. Bar touches lower chest.' },
  { name: 'Incline Barbell Bench Press', muscle_group: 'Chest', secondary_muscles: ['Triceps', 'Shoulders'], equipment: 'Barbell', form_tip: 'Set bench 30-45°. Focus on upper chest activation. Control the descent.' },
  { name: 'Decline Barbell Bench Press', muscle_group: 'Chest', secondary_muscles: ['Triceps'], equipment: 'Barbell', form_tip: 'Targets lower chest. Keep elbows at 45° from torso.' },
  { name: 'Dumbbell Bench Press', muscle_group: 'Chest', secondary_muscles: ['Triceps', 'Shoulders'], equipment: 'Dumbbell', form_tip: 'Greater range of motion than barbell. Let the weights touch at the top.' },
  { name: 'Incline Dumbbell Press', muscle_group: 'Chest', secondary_muscles: ['Triceps', 'Shoulders'], equipment: 'Dumbbell', form_tip: 'Best upper chest exercise. 30-45° incline. Full stretch at the bottom.' },
  { name: 'Dumbbell Flyes', muscle_group: 'Chest', secondary_muscles: [], equipment: 'Dumbbell', form_tip: 'Slight bend in elbows throughout. Think "hugging a tree." Focus on the stretch.' },
  { name: 'Cable Flyes', muscle_group: 'Chest', secondary_muscles: [], equipment: 'Cable', form_tip: 'Set cables at shoulder height. Keep slight elbow bend. Squeeze at center.' },
  { name: 'High Cable Flyes', muscle_group: 'Chest', secondary_muscles: [], equipment: 'Cable', form_tip: 'Cables high, pull down and together. Targets lower chest.' },
  { name: 'Low Cable Flyes', muscle_group: 'Chest', secondary_muscles: [], equipment: 'Cable', form_tip: 'Cables low, pull up and together. Best for upper chest isolation.' },
  { name: 'Push-Up', muscle_group: 'Chest', secondary_muscles: ['Triceps', 'Shoulders'], equipment: 'Bodyweight', form_tip: 'Keep core tight, body in straight line. Touch chest to floor for full ROM.' },
  { name: 'Wide-Grip Push-Up', muscle_group: 'Chest', secondary_muscles: ['Shoulders'], equipment: 'Bodyweight', form_tip: 'Hands wider than shoulder-width targets outer chest.' },
  { name: 'Chest Dips', muscle_group: 'Chest', secondary_muscles: ['Triceps'], equipment: 'Bodyweight', form_tip: 'Lean forward 30° to target chest. Lower until upper arms parallel to floor.' },
  { name: 'Pec Deck / Machine Flyes', muscle_group: 'Chest', secondary_muscles: [], equipment: 'Machine', form_tip: 'Keep back flat against pad. Squeeze hard at full contraction.' },
  { name: 'Smith Machine Bench Press', muscle_group: 'Chest', secondary_muscles: ['Triceps', 'Shoulders'], equipment: 'Smith Machine', form_tip: 'Position body so bar hits mid-chest at bottom of ROM.' },
  { name: 'Landmine Press', muscle_group: 'Chest', secondary_muscles: ['Shoulders', 'Triceps'], equipment: 'Barbell', form_tip: 'One hand, press barbell anchored at floor. Great for upper chest.' },

  // BACK
  { name: 'Deadlift', muscle_group: 'Back', secondary_muscles: ['Glutes', 'Hamstrings', 'Quads'], equipment: 'Barbell', form_tip: 'Hinge at hips, neutral spine. Drive floor away, not pull bar up. Bar stays close to body.' },
  { name: 'Romanian Deadlift', muscle_group: 'Back', secondary_muscles: ['Hamstrings', 'Glutes'], equipment: 'Barbell', form_tip: 'Slight knee bend, push hips back. Feel hamstring stretch before reversing.' },
  { name: 'Barbell Row', muscle_group: 'Back', secondary_muscles: ['Biceps', 'Rear Delts'], equipment: 'Barbell', form_tip: 'Hinge 45°, pull bar to navel. Lead with elbows. Keep back flat.' },
  { name: 'Pendlay Row', muscle_group: 'Back', secondary_muscles: ['Biceps', 'Rear Delts'], equipment: 'Barbell', form_tip: 'Explosive pull from floor to chest. Back parallel to floor. Controlled descent.' },
  { name: 'T-Bar Row', muscle_group: 'Back', secondary_muscles: ['Biceps', 'Rear Delts'], equipment: 'Barbell', form_tip: 'Chest on pad, pull handle to chest. Squeeze lats at top.' },
  { name: 'Dumbbell Row', muscle_group: 'Back', secondary_muscles: ['Biceps'], equipment: 'Dumbbell', form_tip: 'Place knee on bench, pull dumbbell to hip. Elbow grazes your side.' },
  { name: 'Pull-Up', muscle_group: 'Back', secondary_muscles: ['Biceps', 'Rear Delts'], equipment: 'Bodyweight', form_tip: 'Start from dead hang. Retract scapula before pulling. Chest to bar.' },
  { name: 'Chin-Up', muscle_group: 'Back', secondary_muscles: ['Biceps'], equipment: 'Bodyweight', form_tip: 'Supinated grip (palms toward you). Greater bicep involvement than pull-ups.' },
  { name: 'Lat Pulldown', muscle_group: 'Back', secondary_muscles: ['Biceps'], equipment: 'Cable', form_tip: 'Pull bar to upper chest, not behind neck. Lead with elbows down and back.' },
  { name: 'Close-Grip Lat Pulldown', muscle_group: 'Back', secondary_muscles: ['Biceps'], equipment: 'Cable', form_tip: 'Neutral grip, pull to chest. Great lat stretch at the top.' },
  { name: 'Seated Cable Row', muscle_group: 'Back', secondary_muscles: ['Biceps', 'Rear Delts'], equipment: 'Cable', form_tip: 'Pull to navel, squeeze shoulder blades. Sit tall, minimal torso lean.' },
  { name: 'Single-Arm Cable Row', muscle_group: 'Back', secondary_muscles: ['Biceps'], equipment: 'Cable', form_tip: 'Full rotation allows greater range of motion. Rotate and reach, then pull.' },
  { name: 'Hyperextension', muscle_group: 'Back', secondary_muscles: ['Glutes', 'Hamstrings'], equipment: 'Machine', form_tip: 'Focus on lower back extension. Squeeze glutes at top, don\'t hyperextend spine.' },
  { name: 'Good Morning', muscle_group: 'Back', secondary_muscles: ['Hamstrings', 'Glutes'], equipment: 'Barbell', form_tip: 'Bar on upper back. Hinge at hips with slight knee bend. Keep back flat.' },
  { name: 'Meadows Row', muscle_group: 'Back', secondary_muscles: ['Biceps', 'Rear Delts'], equipment: 'Barbell', form_tip: 'Landmine-style unilateral row. Pull to hip, great for lat thickness.' },
  { name: 'Face Pull', muscle_group: 'Back', secondary_muscles: ['Rear Delts', 'Biceps'], equipment: 'Cable', form_tip: 'Cable at face height, pull rope to forehead. Elbows high. Great for shoulder health.' },

  // SHOULDERS
  { name: 'Overhead Press (OHP)', muscle_group: 'Shoulders', secondary_muscles: ['Triceps', 'Traps'], equipment: 'Barbell', form_tip: 'Press bar overhead in slight arc. Squeeze glutes and abs for stability. Full lockout.' },
  { name: 'Seated Dumbbell Shoulder Press', muscle_group: 'Shoulders', secondary_muscles: ['Triceps'], equipment: 'Dumbbell', form_tip: 'Dumbbells at ear level, press straight up. Full range of motion.' },
  { name: 'Arnold Press', muscle_group: 'Shoulders', secondary_muscles: ['Triceps'], equipment: 'Dumbbell', form_tip: 'Start palms facing you, rotate to press. Hits all three deltoid heads.' },
  { name: 'Lateral Raise', muscle_group: 'Shoulders', secondary_muscles: [], equipment: 'Dumbbell', form_tip: 'Slight forward lean. Raise to shoulder height, pinky up. Control the descent.' },
  { name: 'Cable Lateral Raise', muscle_group: 'Shoulders', secondary_muscles: [], equipment: 'Cable', form_tip: 'Cable provides constant tension. Cross-body cable for unilateral work.' },
  { name: 'Front Raise', muscle_group: 'Shoulders', secondary_muscles: [], equipment: 'Dumbbell', form_tip: 'Palms down, raise to shoulder height. Avoid swinging torso.' },
  { name: 'Rear Delt Flyes', muscle_group: 'Shoulders', secondary_muscles: ['Upper Back'], equipment: 'Dumbbell', form_tip: 'Hinge forward, raise elbows in arc. Targets often-neglected rear delts.' },
  { name: 'Upright Row', muscle_group: 'Shoulders', secondary_muscles: ['Biceps', 'Traps'], equipment: 'Barbell', form_tip: 'Wide grip reduces impingement risk. Pull to chin level.' },
  { name: 'Shrug', muscle_group: 'Shoulders', secondary_muscles: [], equipment: 'Barbell', form_tip: 'Pull straight up, hold briefly. No rolling. Targets upper traps.' },
  { name: 'Machine Shoulder Press', muscle_group: 'Shoulders', secondary_muscles: ['Triceps'], equipment: 'Machine', form_tip: 'Adjust seat so handles are at shoulder level. Full range of motion.' },
  { name: 'Plate Front Raise', muscle_group: 'Shoulders', secondary_muscles: [], equipment: 'Barbell', form_tip: 'Hold plate with both hands. Raise to shoulder height with control.' },
  { name: 'Cable Front Raise', muscle_group: 'Shoulders', secondary_muscles: [], equipment: 'Cable', form_tip: 'Cable provides constant tension throughout the movement.' },

  // BICEPS
  { name: 'Barbell Curl', muscle_group: 'Biceps', secondary_muscles: ['Forearms'], equipment: 'Barbell', form_tip: 'Keep elbows pinned to sides. Full extension at bottom. Squeeze at top.' },
  { name: 'EZ Bar Curl', muscle_group: 'Biceps', secondary_muscles: ['Forearms'], equipment: 'EZ Bar', form_tip: 'Angled grip is easier on wrists. Otherwise same as barbell curl.' },
  { name: 'Dumbbell Curl', muscle_group: 'Biceps', secondary_muscles: ['Forearms'], equipment: 'Dumbbell', form_tip: 'Supinate wrist as you curl (pinky turns up). Full range of motion.' },
  { name: 'Hammer Curl', muscle_group: 'Biceps', secondary_muscles: ['Forearms', 'Brachialis'], equipment: 'Dumbbell', form_tip: 'Neutral grip throughout. Hits brachialis and brachioradialis strongly.' },
  { name: 'Incline Dumbbell Curl', muscle_group: 'Biceps', secondary_muscles: [], equipment: 'Dumbbell', form_tip: 'Arms hang behind torso, maximizing stretch. Best bicep peak exercise.' },
  { name: 'Concentration Curl', muscle_group: 'Biceps', secondary_muscles: [], equipment: 'Dumbbell', form_tip: 'Elbow on inner thigh. Curl straight up. Maximum isolation.' },
  { name: 'Cable Curl', muscle_group: 'Biceps', secondary_muscles: ['Forearms'], equipment: 'Cable', form_tip: 'Constant tension throughout ROM. Use straight or EZ bar attachment.' },
  { name: 'Preacher Curl', muscle_group: 'Biceps', secondary_muscles: [], equipment: 'EZ Bar', form_tip: 'Arm on pad isolates bicep. Don\'t fully lock out to maintain tension.' },
  { name: 'Spider Curl', muscle_group: 'Biceps', secondary_muscles: [], equipment: 'Barbell', form_tip: 'Face down on incline bench. Arms hang freely. Maximum peak contraction.' },
  { name: 'Drag Curl', muscle_group: 'Biceps', secondary_muscles: [], equipment: 'Barbell', form_tip: 'Drag bar up your torso with elbows traveling back. Hits long head hard.' },
  { name: 'Cross-Body Hammer Curl', muscle_group: 'Biceps', secondary_muscles: ['Forearms'], equipment: 'Dumbbell', form_tip: 'Curl across body to opposite shoulder. Great brachialis stretch.' },

  // TRICEPS
  { name: 'Close-Grip Bench Press', muscle_group: 'Triceps', secondary_muscles: ['Chest', 'Shoulders'], equipment: 'Barbell', form_tip: 'Hands shoulder-width (not too close). Elbows stay close to torso.' },
  { name: 'Skull Crusher', muscle_group: 'Triceps', secondary_muscles: [], equipment: 'EZ Bar', form_tip: 'Lower bar to forehead (or behind head). Keep elbows stationary.' },
  { name: 'Overhead Tricep Extension', muscle_group: 'Triceps', secondary_muscles: [], equipment: 'Dumbbell', form_tip: 'Arms behind head maximizes long head stretch. Keep elbows close.' },
  { name: 'Tricep Pushdown', muscle_group: 'Triceps', secondary_muscles: [], equipment: 'Cable', form_tip: 'Elbows pinned to sides. Full extension. Squeeze at bottom.' },
  { name: 'Rope Pushdown', muscle_group: 'Triceps', secondary_muscles: [], equipment: 'Cable', form_tip: 'Flare rope at bottom for full contraction. Great lateral head activation.' },
  { name: 'Overhead Cable Tricep Extension', muscle_group: 'Triceps', secondary_muscles: [], equipment: 'Cable', form_tip: 'Face away from cable, overhead stretch hits long head.' },
  { name: 'Diamond Push-Up', muscle_group: 'Triceps', secondary_muscles: ['Chest'], equipment: 'Bodyweight', form_tip: 'Hands form diamond shape. Keep elbows tracking back, not out.' },
  { name: 'Tricep Dip (Bench)', muscle_group: 'Triceps', secondary_muscles: ['Chest'], equipment: 'Bodyweight', form_tip: 'Hands on bench, lower until 90°. Keep back close to bench.' },
  { name: 'JM Press', muscle_group: 'Triceps', secondary_muscles: ['Chest'], equipment: 'Barbell', form_tip: 'Hybrid between bench and skull crusher. Great tricep overload.' },
  { name: 'Kickback', muscle_group: 'Triceps', secondary_muscles: [], equipment: 'Dumbbell', form_tip: 'Upper arm parallel to floor. Extend and squeeze. Best at full extension.' },

  // LEGS - QUADS
  { name: 'Barbell Back Squat', muscle_group: 'Quads', secondary_muscles: ['Glutes', 'Hamstrings'], equipment: 'Barbell', form_tip: 'Bar on traps, feet shoulder-width. Knees track over toes. Break parallel.' },
  { name: 'Front Squat', muscle_group: 'Quads', secondary_muscles: ['Glutes', 'Core'], equipment: 'Barbell', form_tip: 'Bar on front delts, high elbow position. More upright torso than back squat.' },
  { name: 'Leg Press', muscle_group: 'Quads', secondary_muscles: ['Glutes', 'Hamstrings'], equipment: 'Machine', form_tip: 'High foot placement = more glutes. Low = more quads. Full ROM, no locked knees.' },
  { name: 'Hack Squat', muscle_group: 'Quads', secondary_muscles: ['Glutes'], equipment: 'Machine', form_tip: 'Feet low on platform for more quad focus. Go deep.' },
  { name: 'Bulgarian Split Squat', muscle_group: 'Quads', secondary_muscles: ['Glutes', 'Hamstrings'], equipment: 'Dumbbell', form_tip: 'Rear foot elevated. Front shin stays vertical. Knee over toes is fine.' },
  { name: 'Lunges', muscle_group: 'Quads', secondary_muscles: ['Glutes', 'Hamstrings'], equipment: 'Dumbbell', form_tip: 'Step forward, lower until back knee nearly touches floor. Alternate legs.' },
  { name: 'Leg Extension', muscle_group: 'Quads', secondary_muscles: [], equipment: 'Machine', form_tip: 'Feet flexed for more VMO. Squeeze at top. Control the descent.' },
  { name: 'Goblet Squat', muscle_group: 'Quads', secondary_muscles: ['Glutes', 'Core'], equipment: 'Dumbbell', form_tip: 'Dumbbell at chest. Great for learning squat mechanics.' },
  { name: 'Sissy Squat', muscle_group: 'Quads', secondary_muscles: [], equipment: 'Bodyweight', form_tip: 'Lean back, heels raised. Extreme quad stretch. Use support if needed.' },
  { name: 'Step-Up', muscle_group: 'Quads', secondary_muscles: ['Glutes'], equipment: 'Dumbbell', form_tip: 'Step onto bench, drive through heel. Full hip extension at top.' },

  // LEGS - HAMSTRINGS
  { name: 'Romanian Deadlift (Hamstring Focus)', muscle_group: 'Hamstrings', secondary_muscles: ['Glutes', 'Back'], equipment: 'Barbell', form_tip: 'Soft knee bend, push hips back until you feel deep hamstring stretch.' },
  { name: 'Lying Leg Curl', muscle_group: 'Hamstrings', secondary_muscles: [], equipment: 'Machine', form_tip: 'Curl heels to glutes. Don\'t let hips rise off pad. Squeeze at top.' },
  { name: 'Seated Leg Curl', muscle_group: 'Hamstrings', secondary_muscles: [], equipment: 'Machine', form_tip: 'Seated position provides greater stretch than lying. Full ROM.' },
  { name: 'Nordic Curl', muscle_group: 'Hamstrings', secondary_muscles: [], equipment: 'Bodyweight', form_tip: 'Feet anchored. Lower body with hamstrings resisting. Extremely effective.' },
  { name: 'Stiff-Leg Deadlift', muscle_group: 'Hamstrings', secondary_muscles: ['Back', 'Glutes'], equipment: 'Barbell', form_tip: 'Legs mostly straight. Focus on lower back staying flat.' },
  { name: 'Glute-Ham Raise', muscle_group: 'Hamstrings', secondary_muscles: ['Glutes'], equipment: 'Machine', form_tip: 'Anchor feet, lower torso and raise with hamstrings. Very challenging.' },

  // GLUTES
  { name: 'Hip Thrust', muscle_group: 'Glutes', secondary_muscles: ['Hamstrings'], equipment: 'Barbell', form_tip: 'Upper back on bench, bar on hips. Drive through heels, squeeze at top.' },
  { name: 'Cable Kickback', muscle_group: 'Glutes', secondary_muscles: ['Hamstrings'], equipment: 'Cable', form_tip: 'Ankle attachment, kick leg back and up. Squeeze glute at top.' },
  { name: 'Sumo Deadlift', muscle_group: 'Glutes', secondary_muscles: ['Hamstrings', 'Quads', 'Back'], equipment: 'Barbell', form_tip: 'Wide stance, toes pointed out. More hip abductor and glute activation than conventional.' },
  { name: 'Glute Bridge', muscle_group: 'Glutes', secondary_muscles: ['Hamstrings'], equipment: 'Bodyweight', form_tip: 'On floor, drive hips up. Can add weight for resistance.' },
  { name: 'Donkey Kick', muscle_group: 'Glutes', secondary_muscles: [], equipment: 'Bodyweight', form_tip: 'On all fours, kick leg back and up. Can add ankle weights.' },

  // CALVES
  { name: 'Standing Calf Raise', muscle_group: 'Calves', secondary_muscles: [], equipment: 'Machine', form_tip: 'Full stretch at bottom, full rise at top. Slow and controlled beats fast.' },
  { name: 'Seated Calf Raise', muscle_group: 'Calves', secondary_muscles: [], equipment: 'Machine', form_tip: 'Targets soleus (deeper muscle). Knee bent reduces gastrocnemius involvement.' },
  { name: 'Single-Leg Calf Raise', muscle_group: 'Calves', secondary_muscles: [], equipment: 'Bodyweight', form_tip: 'Harder than bilateral. Full ROM on a step. Slow and deliberate.' },
  { name: 'Leg Press Calf Raise', muscle_group: 'Calves', secondary_muscles: [], equipment: 'Machine', form_tip: 'Toes on edge of leg press platform. Full ROM. Very effective.' },
  { name: 'Box Jump Calf Raise', muscle_group: 'Calves', secondary_muscles: [], equipment: 'Bodyweight', form_tip: 'Explosive calf raise onto box. Good for athletic power.' },

  // ABS / CORE
  { name: 'Crunch', muscle_group: 'Abs', secondary_muscles: [], equipment: 'Bodyweight', form_tip: 'Don\'t pull on neck. Curl upper body using abs. Exhale on the way up.' },
  { name: 'Cable Crunch', muscle_group: 'Abs', secondary_muscles: [], equipment: 'Cable', form_tip: 'Kneel facing cable. Curl down with abs, not hip flexors. Keep hips still.' },
  { name: 'Plank', muscle_group: 'Abs', secondary_muscles: ['Shoulders', 'Glutes'], equipment: 'Bodyweight', form_tip: 'Elbows under shoulders, body straight. Squeeze abs and glutes. Don\'t sag hips.' },
  { name: 'Hollow Hold', muscle_group: 'Abs', secondary_muscles: [], equipment: 'Bodyweight', form_tip: 'Lower back pressed to floor. Arms overhead, legs at 45°. Hold position.' },
  { name: 'Ab Wheel Rollout', muscle_group: 'Abs', secondary_muscles: ['Shoulders', 'Back'], equipment: 'Bodyweight', form_tip: 'Knees down to start. Roll out slowly, abs resist extension. Pull back in.' },
  { name: 'Hanging Leg Raise', muscle_group: 'Abs', secondary_muscles: ['Hip Flexors'], equipment: 'Bodyweight', form_tip: 'From dead hang. Raise legs to 90° or higher. Don\'t swing. Controlled.' },
  { name: 'Russian Twist', muscle_group: 'Abs', secondary_muscles: ['Obliques'], equipment: 'Bodyweight', form_tip: 'Feet up or down. Twist torso side to side. Add weight for progression.' },
  { name: 'Side Plank', muscle_group: 'Abs', secondary_muscles: ['Obliques', 'Shoulders'], equipment: 'Bodyweight', form_tip: 'Elbow under shoulder. Body in straight line. Hold or add hip dips.' },
  { name: 'Dragon Flag', muscle_group: 'Abs', secondary_muscles: ['Core'], equipment: 'Bodyweight', form_tip: 'Advanced: lift whole body off bench anchored at shoulders. Full body control.' },
  { name: 'V-Up', muscle_group: 'Abs', secondary_muscles: ['Hip Flexors'], equipment: 'Bodyweight', form_tip: 'Simultaneously raise legs and torso to form a V shape.' },
  { name: 'Dead Bug', muscle_group: 'Abs', secondary_muscles: ['Core'], equipment: 'Bodyweight', form_tip: 'Lower back stays pressed down. Extend opposite arm and leg simultaneously.' },
  { name: 'Mountain Climber', muscle_group: 'Abs', secondary_muscles: ['Shoulders', 'Hip Flexors'], equipment: 'Bodyweight', form_tip: 'Plank position. Drive knees to chest alternately. Keep hips low.' },
  { name: 'Bicycle Crunch', muscle_group: 'Abs', secondary_muscles: ['Obliques'], equipment: 'Bodyweight', form_tip: 'Elbow to opposite knee. Don\'t rush. Feel the oblique contraction.' },

  // FOREARMS
  { name: 'Wrist Curl', muscle_group: 'Forearms', secondary_muscles: [], equipment: 'Barbell', form_tip: 'Forearms on thighs, curl wrists up. Full range of motion.' },
  { name: 'Reverse Wrist Curl', muscle_group: 'Forearms', secondary_muscles: [], equipment: 'Barbell', form_tip: 'Palms down, curl wrists up. Hits extensors.' },
  { name: 'Farmer\'s Walk', muscle_group: 'Forearms', secondary_muscles: ['Traps', 'Core'], equipment: 'Dumbbell', form_tip: 'Heavy dumbbells, walk with good posture. Great grip strength builder.' },
  { name: 'Plate Pinch', muscle_group: 'Forearms', secondary_muscles: [], equipment: 'Barbell', form_tip: 'Pinch weight plate between fingers and thumb. Hold for time.' },
  { name: 'Dead Hang', muscle_group: 'Forearms', secondary_muscles: ['Back', 'Shoulders'], equipment: 'Bodyweight', form_tip: 'Hang from bar as long as possible. Improves grip and shoulder health.' },

  // FULL BODY
  { name: 'Barbell Clean', muscle_group: 'Full Body', secondary_muscles: ['Back', 'Legs', 'Shoulders'], equipment: 'Barbell', form_tip: 'Explosive pull from floor, catch in front rack. Olympic lift.' },
  { name: 'Power Clean', muscle_group: 'Full Body', secondary_muscles: ['Back', 'Legs', 'Shoulders'], equipment: 'Barbell', form_tip: 'Like clean but caught in quarter squat. Develops explosive power.' },
  { name: 'Thruster', muscle_group: 'Full Body', secondary_muscles: ['Legs', 'Shoulders', 'Core'], equipment: 'Barbell', form_tip: 'Front squat into overhead press in one fluid movement.' },
  { name: 'Burpee', muscle_group: 'Full Body', secondary_muscles: ['Chest', 'Shoulders', 'Legs'], equipment: 'Bodyweight', form_tip: 'Drop to plank, push-up, jump up. Keep moving at consistent pace.' },
  { name: 'Kettlebell Swing', muscle_group: 'Full Body', secondary_muscles: ['Glutes', 'Hamstrings', 'Back'], equipment: 'Kettlebell', form_tip: 'Hinge pattern, not a squat. Hip drive swings the bell. Snap hips forward.' },
  { name: 'Turkish Get-Up', muscle_group: 'Full Body', secondary_muscles: ['Shoulders', 'Core', 'Legs'], equipment: 'Kettlebell', form_tip: 'Slow and controlled. Keep eyes on the bell throughout. Every step matters.' },
  { name: 'Bear Complex', muscle_group: 'Full Body', secondary_muscles: ['Back', 'Legs', 'Shoulders'], equipment: 'Barbell', form_tip: 'Power clean → front squat → push press → back squat → push press. One rep.' },
  { name: 'Battle Ropes', muscle_group: 'Full Body', secondary_muscles: ['Shoulders', 'Core', 'Biceps'], equipment: 'Bodyweight', form_tip: 'Alternate or simultaneous waves. Great conditioning tool.' },
  { name: 'Sled Push', muscle_group: 'Full Body', secondary_muscles: ['Legs', 'Core'], equipment: 'Machine', form_tip: 'Drive through legs. Lean forward into sled. No momentum.' },
  { name: 'Box Jump', muscle_group: 'Full Body', secondary_muscles: ['Quads', 'Glutes', 'Calves'], equipment: 'Bodyweight', form_tip: 'Jump explosively, land softly with knees bent. Step down, don\'t jump.' },
  { name: 'Med Ball Slam', muscle_group: 'Full Body', secondary_muscles: ['Abs', 'Shoulders', 'Back'], equipment: 'Bodyweight', form_tip: 'Raise overhead, slam down with force. Hinge to pick up. Great for power.' },

  // ADDITIONAL CHEST
  { name: 'Chest Press Machine', muscle_group: 'Chest', secondary_muscles: ['Triceps', 'Shoulders'], equipment: 'Machine', form_tip: 'Adjust so handles are at mid-chest. Full range of motion.' },
  { name: 'Svend Press', muscle_group: 'Chest', secondary_muscles: [], equipment: 'Barbell', form_tip: 'Squeeze two plates together while pressing out. Constant chest squeeze.' },

  // ADDITIONAL BACK
  { name: 'Rack Pull', muscle_group: 'Back', secondary_muscles: ['Glutes', 'Traps'], equipment: 'Barbell', form_tip: 'Deadlift from knee height. Focus on upper back and traps. Heavy overload.' },
  { name: 'Chest-Supported Row', muscle_group: 'Back', secondary_muscles: ['Biceps', 'Rear Delts'], equipment: 'Dumbbell', form_tip: 'Chest on incline bench eliminates body swing. Pure back isolation.' },
  { name: 'Inverted Row', muscle_group: 'Back', secondary_muscles: ['Biceps', 'Rear Delts'], equipment: 'Bodyweight', form_tip: 'Body under bar, pull chest to bar. Difficulty adjustable by leg position.' },
  { name: 'Straight-Arm Pulldown', muscle_group: 'Back', secondary_muscles: [], equipment: 'Cable', form_tip: 'Arms straight throughout. Pull bar to thighs. Great lat isolation.' },
  { name: 'Cable Pullover', muscle_group: 'Back', secondary_muscles: ['Chest'], equipment: 'Cable', form_tip: 'Arms straight, pull from overhead to thighs. Hits serratus and lats.' },

  // ADDITIONAL SHOULDER
  { name: 'Leaning Lateral Raise', muscle_group: 'Shoulders', secondary_muscles: [], equipment: 'Dumbbell', form_tip: 'Lean away from support, pure lateral raise. Maximizes middle delt.' },
  { name: 'Bent-Over Lateral Raise', muscle_group: 'Shoulders', secondary_muscles: ['Upper Back'], equipment: 'Dumbbell', form_tip: 'Hinge forward, raise arms in arc. Primary rear delt exercise.' },
  { name: 'Cable Y Raise', muscle_group: 'Shoulders', secondary_muscles: ['Upper Back'], equipment: 'Cable', form_tip: 'Low cable, raise arms to form Y. Targets lower traps and rear delts.' },

  // ADDITIONAL BICEPS
  { name: 'Zottman Curl', muscle_group: 'Biceps', secondary_muscles: ['Forearms'], equipment: 'Dumbbell', form_tip: 'Curl up with supinated grip, rotate and lower with pronated grip.' },
  { name: 'Band Curl', muscle_group: 'Biceps', secondary_muscles: ['Forearms'], equipment: 'Band', form_tip: 'Stand on band, curl both arms up simultaneously.' },

  // ADDITIONAL TRICEPS
  { name: 'Tate Press', muscle_group: 'Triceps', secondary_muscles: [], equipment: 'Dumbbell', form_tip: 'Elbows up, lower dumbbells to chest by bending elbows outward.' },
  { name: 'Band Pushdown', muscle_group: 'Triceps', secondary_muscles: [], equipment: 'Band', form_tip: 'Anchor band overhead. Same movement as cable pushdown.' },

  // ADDITIONAL LEGS
  { name: 'Sumo Squat', muscle_group: 'Quads', secondary_muscles: ['Glutes', 'Inner Thighs'], equipment: 'Dumbbell', form_tip: 'Wide stance, toes out. Dumbbell hanging between legs. Target inner thighs.' },
  { name: 'Reverse Lunge', muscle_group: 'Quads', secondary_muscles: ['Glutes', 'Hamstrings'], equipment: 'Dumbbell', form_tip: 'Step backward, lower back knee toward floor. Less knee stress than forward lunge.' },
  { name: 'Walking Lunge', muscle_group: 'Quads', secondary_muscles: ['Glutes', 'Hamstrings'], equipment: 'Dumbbell', form_tip: 'Continuous walking pattern. Great for muscular endurance.' },
  { name: 'Lateral Squat', muscle_group: 'Quads', secondary_muscles: ['Glutes', 'Inner Thighs'], equipment: 'Bodyweight', form_tip: 'Step to side, sit into one leg while other stays straight.' },
  { name: 'Cossack Squat', muscle_group: 'Quads', secondary_muscles: ['Glutes', 'Hamstrings'], equipment: 'Bodyweight', form_tip: 'Deep squat to one side. Requires significant hip mobility.' },
  { name: 'Leg Press (Single Leg)', muscle_group: 'Quads', secondary_muscles: ['Glutes'], equipment: 'Machine', form_tip: 'Unilateral leg press addresses imbalances.' },

  // ADDITIONAL ABS
  { name: 'Pallof Press', muscle_group: 'Abs', secondary_muscles: ['Obliques'], equipment: 'Cable', form_tip: 'Cable at chest height, press away from anchor. Anti-rotation core work.' },
  { name: 'Woodchop', muscle_group: 'Abs', secondary_muscles: ['Obliques', 'Shoulders'], equipment: 'Cable', form_tip: 'Diagonal pulling motion from high to low. Rotational power.' },
  { name: 'Toe Touch', muscle_group: 'Abs', secondary_muscles: [], equipment: 'Bodyweight', form_tip: 'Legs vertical, reach up toward toes. Short range but strong contraction.' },
  { name: 'L-Sit', muscle_group: 'Abs', secondary_muscles: ['Hip Flexors', 'Triceps'], equipment: 'Bodyweight', form_tip: 'Support on bars or floor, hold legs parallel to floor. Extremely demanding.' },
  { name: 'Cable Woodchop (Rotational)', muscle_group: 'Abs', secondary_muscles: ['Obliques'], equipment: 'Cable', form_tip: 'Rotate from high to low diagonal. Keep arms straight.' },
];

export function getExercisesByMuscleGroup(muscleGroup: string) {
  return EXERCISES.filter((e) => e.muscle_group === muscleGroup);
}

export function searchExercises(query: string) {
  const lower = query.toLowerCase();
  return EXERCISES.filter(
    (e) =>
      e.name.toLowerCase().includes(lower) ||
      e.muscle_group.toLowerCase().includes(lower) ||
      e.equipment.toLowerCase().includes(lower)
  );
}
