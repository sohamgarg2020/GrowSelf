-- Seed exercises into the database
-- Run this after applying schema.sql

INSERT INTO exercises (name, muscle_group, secondary_muscles, equipment, form_tip, is_custom) VALUES
-- CHEST
('Barbell Bench Press', 'Chest', '{"Triceps","Shoulders"}', 'Barbell', 'Keep shoulder blades retracted and feet flat on floor. Bar touches lower chest.', false),
('Incline Barbell Bench Press', 'Chest', '{"Triceps","Shoulders"}', 'Barbell', 'Set bench 30-45°. Focus on upper chest activation. Control the descent.', false),
('Dumbbell Bench Press', 'Chest', '{"Triceps","Shoulders"}', 'Dumbbell', 'Greater range of motion than barbell. Let the weights touch at the top.', false),
('Incline Dumbbell Press', 'Chest', '{"Triceps","Shoulders"}', 'Dumbbell', 'Best upper chest exercise. 30-45° incline. Full stretch at the bottom.', false),
('Cable Flyes', 'Chest', '{}', 'Cable', 'Set cables at shoulder height. Keep slight elbow bend. Squeeze at center.', false),
('Push-Up', 'Chest', '{"Triceps","Shoulders"}', 'Bodyweight', 'Keep core tight, body in straight line. Touch chest to floor for full ROM.', false),
('Chest Dips', 'Chest', '{"Triceps"}', 'Bodyweight', 'Lean forward 30° to target chest. Lower until upper arms parallel to floor.', false),
('Pec Deck', 'Chest', '{}', 'Machine', 'Keep back flat against pad. Squeeze hard at full contraction.', false),
('High Cable Flyes', 'Chest', '{}', 'Cable', 'Cables high, pull down and together. Targets lower chest.', false),
('Dumbbell Flyes', 'Chest', '{}', 'Dumbbell', 'Slight bend in elbows throughout. Think hugging a tree. Focus on the stretch.', false),

-- BACK
('Deadlift', 'Back', '{"Glutes","Hamstrings","Quads"}', 'Barbell', 'Hinge at hips, neutral spine. Drive floor away, not pull bar up. Bar stays close to body.', false),
('Barbell Row', 'Back', '{"Biceps","Rear Delts"}', 'Barbell', 'Hinge 45°, pull bar to navel. Lead with elbows. Keep back flat.', false),
('Pull-Up', 'Back', '{"Biceps","Rear Delts"}', 'Bodyweight', 'Start from dead hang. Retract scapula before pulling. Chest to bar.', false),
('Chin-Up', 'Back', '{"Biceps"}', 'Bodyweight', 'Supinated grip (palms toward you). Greater bicep involvement than pull-ups.', false),
('Lat Pulldown', 'Back', '{"Biceps"}', 'Cable', 'Pull bar to upper chest, not behind neck. Lead with elbows down and back.', false),
('Seated Cable Row', 'Back', '{"Biceps","Rear Delts"}', 'Cable', 'Pull to navel, squeeze shoulder blades. Sit tall, minimal torso lean.', false),
('Dumbbell Row', 'Back', '{"Biceps"}', 'Dumbbell', 'Place knee on bench, pull dumbbell to hip. Elbow grazes your side.', false),
('T-Bar Row', 'Back', '{"Biceps","Rear Delts"}', 'Barbell', 'Chest on pad, pull handle to chest. Squeeze lats at top.', false),
('Face Pull', 'Back', '{"Rear Delts","Biceps"}', 'Cable', 'Cable at face height, pull rope to forehead. Elbows high. Great for shoulder health.', false),
('Romanian Deadlift', 'Back', '{"Hamstrings","Glutes"}', 'Barbell', 'Slight knee bend, push hips back. Feel hamstring stretch before reversing.', false),

-- SHOULDERS
('Overhead Press (OHP)', 'Shoulders', '{"Triceps","Traps"}', 'Barbell', 'Press bar overhead in slight arc. Squeeze glutes and abs for stability. Full lockout.', false),
('Seated Dumbbell Shoulder Press', 'Shoulders', '{"Triceps"}', 'Dumbbell', 'Dumbbells at ear level, press straight up. Full range of motion.', false),
('Arnold Press', 'Shoulders', '{"Triceps"}', 'Dumbbell', 'Start palms facing you, rotate to press. Hits all three deltoid heads.', false),
('Lateral Raise', 'Shoulders', '{}', 'Dumbbell', 'Slight forward lean. Raise to shoulder height, pinky up. Control the descent.', false),
('Front Raise', 'Shoulders', '{}', 'Dumbbell', 'Palms down, raise to shoulder height. Avoid swinging torso.', false),
('Rear Delt Flyes', 'Shoulders', '{"Upper Back"}', 'Dumbbell', 'Hinge forward, raise elbows in arc. Targets often-neglected rear delts.', false),
('Cable Lateral Raise', 'Shoulders', '{}', 'Cable', 'Cable provides constant tension. Cross-body cable for unilateral work.', false),
('Shrug', 'Shoulders', '{}', 'Barbell', 'Pull straight up, hold briefly. No rolling. Targets upper traps.', false),

-- BICEPS
('Barbell Curl', 'Biceps', '{"Forearms"}', 'Barbell', 'Keep elbows pinned to sides. Full extension at bottom. Squeeze at top.', false),
('EZ Bar Curl', 'Biceps', '{"Forearms"}', 'EZ Bar', 'Angled grip is easier on wrists. Otherwise same as barbell curl.', false),
('Dumbbell Curl', 'Biceps', '{"Forearms"}', 'Dumbbell', 'Supinate wrist as you curl (pinky turns up). Full range of motion.', false),
('Hammer Curl', 'Biceps', '{"Forearms","Brachialis"}', 'Dumbbell', 'Neutral grip throughout. Hits brachialis and brachioradialis strongly.', false),
('Incline Dumbbell Curl', 'Biceps', '{}', 'Dumbbell', 'Arms hang behind torso, maximizing stretch. Best bicep peak exercise.', false),
('Preacher Curl', 'Biceps', '{}', 'EZ Bar', 'Arm on pad isolates bicep. Do not fully lock out to maintain tension.', false),
('Cable Curl', 'Biceps', '{"Forearms"}', 'Cable', 'Constant tension throughout ROM. Use straight or EZ bar attachment.', false),
('Concentration Curl', 'Biceps', '{}', 'Dumbbell', 'Elbow on inner thigh. Curl straight up. Maximum isolation.', false),

-- TRICEPS
('Close-Grip Bench Press', 'Triceps', '{"Chest","Shoulders"}', 'Barbell', 'Hands shoulder-width. Elbows stay close to torso.', false),
('Skull Crusher', 'Triceps', '{}', 'EZ Bar', 'Lower bar to forehead (or behind head). Keep elbows stationary.', false),
('Overhead Tricep Extension', 'Triceps', '{}', 'Dumbbell', 'Arms behind head maximizes long head stretch. Keep elbows close.', false),
('Tricep Pushdown', 'Triceps', '{}', 'Cable', 'Elbows pinned to sides. Full extension. Squeeze at bottom.', false),
('Rope Pushdown', 'Triceps', '{}', 'Cable', 'Flare rope at bottom for full contraction. Great lateral head activation.', false),
('Diamond Push-Up', 'Triceps', '{"Chest"}', 'Bodyweight', 'Hands form diamond shape. Keep elbows tracking back, not out.', false),

-- QUADS
('Barbell Back Squat', 'Quads', '{"Glutes","Hamstrings"}', 'Barbell', 'Bar on traps, feet shoulder-width. Knees track over toes. Break parallel.', false),
('Front Squat', 'Quads', '{"Glutes","Core"}', 'Barbell', 'Bar on front delts, high elbow position. More upright torso than back squat.', false),
('Leg Press', 'Quads', '{"Glutes","Hamstrings"}', 'Machine', 'High foot placement = more glutes. Low = more quads. Full ROM, no locked knees.', false),
('Hack Squat', 'Quads', '{"Glutes"}', 'Machine', 'Feet low on platform for more quad focus. Go deep.', false),
('Bulgarian Split Squat', 'Quads', '{"Glutes","Hamstrings"}', 'Dumbbell', 'Rear foot elevated. Front shin stays vertical. Knee over toes is fine.', false),
('Leg Extension', 'Quads', '{}', 'Machine', 'Feet flexed for more VMO. Squeeze at top. Control the descent.', false),
('Lunges', 'Quads', '{"Glutes","Hamstrings"}', 'Dumbbell', 'Step forward, lower until back knee nearly touches floor. Alternate legs.', false),

-- HAMSTRINGS
('Lying Leg Curl', 'Hamstrings', '{}', 'Machine', 'Curl heels to glutes. Do not let hips rise off pad. Squeeze at top.', false),
('Seated Leg Curl', 'Hamstrings', '{}', 'Machine', 'Seated position provides greater stretch than lying. Full ROM.', false),
('Nordic Curl', 'Hamstrings', '{}', 'Bodyweight', 'Feet anchored. Lower body with hamstrings resisting. Extremely effective.', false),
('Stiff-Leg Deadlift', 'Hamstrings', '{"Back","Glutes"}', 'Barbell', 'Legs mostly straight. Focus on lower back staying flat.', false),

-- GLUTES
('Hip Thrust', 'Glutes', '{"Hamstrings"}', 'Barbell', 'Upper back on bench, bar on hips. Drive through heels, squeeze at top.', false),
('Cable Kickback', 'Glutes', '{"Hamstrings"}', 'Cable', 'Ankle attachment, kick leg back and up. Squeeze glute at top.', false),
('Sumo Deadlift', 'Glutes', '{"Hamstrings","Quads","Back"}', 'Barbell', 'Wide stance, toes pointed out. More hip abductor and glute activation than conventional.', false),
('Glute Bridge', 'Glutes', '{"Hamstrings"}', 'Bodyweight', 'On floor, drive hips up. Can add weight for resistance.', false),

-- CALVES
('Standing Calf Raise', 'Calves', '{}', 'Machine', 'Full stretch at bottom, full rise at top. Slow and controlled beats fast.', false),
('Seated Calf Raise', 'Calves', '{}', 'Machine', 'Targets soleus (deeper muscle). Knee bent reduces gastrocnemius involvement.', false),
('Single-Leg Calf Raise', 'Calves', '{}', 'Bodyweight', 'Harder than bilateral. Full ROM on a step. Slow and deliberate.', false),

-- ABS
('Crunch', 'Abs', '{}', 'Bodyweight', 'Do not pull on neck. Curl upper body using abs. Exhale on the way up.', false),
('Plank', 'Abs', '{"Shoulders","Glutes"}', 'Bodyweight', 'Elbows under shoulders, body straight. Squeeze abs and glutes. Do not sag hips.', false),
('Cable Crunch', 'Abs', '{}', 'Cable', 'Kneel facing cable. Curl down with abs, not hip flexors. Keep hips still.', false),
('Hanging Leg Raise', 'Abs', '{"Hip Flexors"}', 'Bodyweight', 'From dead hang. Raise legs to 90° or higher. Do not swing. Controlled.', false),
('Ab Wheel Rollout', 'Abs', '{"Shoulders","Back"}', 'Bodyweight', 'Knees down to start. Roll out slowly, abs resist extension. Pull back in.', false),
('Russian Twist', 'Abs', '{"Obliques"}', 'Bodyweight', 'Feet up or down. Twist torso side to side. Add weight for progression.', false),
('Bicycle Crunch', 'Abs', '{"Obliques"}', 'Bodyweight', 'Elbow to opposite knee. Do not rush. Feel the oblique contraction.', false),
('Mountain Climber', 'Abs', '{"Shoulders","Hip Flexors"}', 'Bodyweight', 'Plank position. Drive knees to chest alternately. Keep hips low.', false),

-- FULL BODY
('Kettlebell Swing', 'Full Body', '{"Glutes","Hamstrings","Back"}', 'Kettlebell', 'Hinge pattern, not a squat. Hip drive swings the bell. Snap hips forward.', false),
('Burpee', 'Full Body', '{"Chest","Shoulders","Legs"}', 'Bodyweight', 'Drop to plank, push-up, jump up. Keep moving at consistent pace.', false),
('Box Jump', 'Full Body', '{"Quads","Glutes","Calves"}', 'Bodyweight', 'Jump explosively, land softly with knees bent. Step down, do not jump.', false),
('Thruster', 'Full Body', '{"Legs","Shoulders","Core"}', 'Barbell', 'Front squat into overhead press in one fluid movement.', false),
('Med Ball Slam', 'Full Body', '{"Abs","Shoulders","Back"}', 'Bodyweight', 'Raise overhead, slam down with force. Hinge to pick up. Great for power.', false)

ON CONFLICT DO NOTHING;

-- Seed programs
INSERT INTO programs (name, description, days_per_week, difficulty, program_days_json) VALUES
(
  'PPL — Push Pull Legs (6-Day)',
  'The most popular hypertrophy program. Train 6 days/week with push, pull, and legs twice per week.',
  6,
  'intermediate',
  '[{"day_number":1,"label":"Push A","muscle_groups":["Chest","Shoulders","Triceps"],"exercises":[{"exercise_name":"Barbell Bench Press","sets":4,"reps":"6-8","rest_seconds":180},{"exercise_name":"Incline Dumbbell Press","sets":3,"reps":"8-12","rest_seconds":120},{"exercise_name":"Cable Flyes","sets":3,"reps":"12-15","rest_seconds":90},{"exercise_name":"Overhead Press (OHP)","sets":3,"reps":"8-10","rest_seconds":150},{"exercise_name":"Lateral Raise","sets":4,"reps":"15-20","rest_seconds":60},{"exercise_name":"Tricep Pushdown","sets":3,"reps":"12-15","rest_seconds":60},{"exercise_name":"Skull Crusher","sets":3,"reps":"10-12","rest_seconds":90}]},{"day_number":2,"label":"Pull A","muscle_groups":["Back","Biceps","Rear Delts"],"exercises":[{"exercise_name":"Deadlift","sets":4,"reps":"4-6","rest_seconds":240},{"exercise_name":"Barbell Row","sets":4,"reps":"6-8","rest_seconds":180},{"exercise_name":"Pull-Up","sets":3,"reps":"6-10","rest_seconds":150},{"exercise_name":"Seated Cable Row","sets":3,"reps":"10-12","rest_seconds":90},{"exercise_name":"Face Pull","sets":3,"reps":"15-20","rest_seconds":60},{"exercise_name":"Barbell Curl","sets":3,"reps":"8-10","rest_seconds":90},{"exercise_name":"Hammer Curl","sets":3,"reps":"12-15","rest_seconds":60}]},{"day_number":3,"label":"Legs A","muscle_groups":["Quads","Hamstrings","Calves","Glutes"],"exercises":[{"exercise_name":"Barbell Back Squat","sets":4,"reps":"6-8","rest_seconds":240},{"exercise_name":"Romanian Deadlift","sets":3,"reps":"8-10","rest_seconds":180},{"exercise_name":"Leg Press","sets":3,"reps":"10-15","rest_seconds":120},{"exercise_name":"Leg Extension","sets":3,"reps":"12-15","rest_seconds":90},{"exercise_name":"Lying Leg Curl","sets":3,"reps":"12-15","rest_seconds":90},{"exercise_name":"Standing Calf Raise","sets":4,"reps":"12-15","rest_seconds":60}]},{"day_number":4,"label":"Push B","muscle_groups":["Chest","Shoulders","Triceps"],"exercises":[{"exercise_name":"Incline Barbell Bench Press","sets":4,"reps":"6-8","rest_seconds":180},{"exercise_name":"Dumbbell Bench Press","sets":3,"reps":"8-12","rest_seconds":120},{"exercise_name":"High Cable Flyes","sets":3,"reps":"12-15","rest_seconds":90},{"exercise_name":"Arnold Press","sets":3,"reps":"10-12","rest_seconds":120},{"exercise_name":"Lateral Raise","sets":4,"reps":"15-20","rest_seconds":60},{"exercise_name":"Overhead Tricep Extension","sets":3,"reps":"12-15","rest_seconds":60},{"exercise_name":"Rope Pushdown","sets":3,"reps":"12-15","rest_seconds":60}]},{"day_number":5,"label":"Pull B","muscle_groups":["Back","Biceps","Rear Delts"],"exercises":[{"exercise_name":"Pull-Up","sets":4,"reps":"6-10","rest_seconds":150},{"exercise_name":"Dumbbell Row","sets":4,"reps":"8-10","rest_seconds":120},{"exercise_name":"Lat Pulldown","sets":3,"reps":"10-12","rest_seconds":90},{"exercise_name":"Straight-Arm Pulldown","sets":3,"reps":"12-15","rest_seconds":60},{"exercise_name":"Rear Delt Flyes","sets":4,"reps":"15-20","rest_seconds":60},{"exercise_name":"Incline Dumbbell Curl","sets":3,"reps":"10-12","rest_seconds":90},{"exercise_name":"Cable Curl","sets":3,"reps":"12-15","rest_seconds":60}]},{"day_number":6,"label":"Legs B","muscle_groups":["Quads","Hamstrings","Calves","Glutes"],"exercises":[{"exercise_name":"Romanian Deadlift","sets":4,"reps":"8-10","rest_seconds":180},{"exercise_name":"Hack Squat","sets":3,"reps":"8-12","rest_seconds":150},{"exercise_name":"Bulgarian Split Squat","sets":3,"reps":"10-12","rest_seconds":120},{"exercise_name":"Leg Extension","sets":3,"reps":"15-20","rest_seconds":60},{"exercise_name":"Seated Leg Curl","sets":3,"reps":"12-15","rest_seconds":90},{"exercise_name":"Seated Calf Raise","sets":4,"reps":"15-20","rest_seconds":60},{"exercise_name":"Hip Thrust","sets":3,"reps":"12-15","rest_seconds":90}]}]'
),
(
  'Full Body 3x/Week',
  'Train your whole body three times per week. Ideal for beginners and those with limited time.',
  3,
  'beginner',
  '[{"day_number":1,"label":"Full Body A","muscle_groups":["Full Body"],"exercises":[{"exercise_name":"Barbell Back Squat","sets":3,"reps":"8-10","rest_seconds":180},{"exercise_name":"Barbell Bench Press","sets":3,"reps":"8-10","rest_seconds":150},{"exercise_name":"Barbell Row","sets":3,"reps":"8-10","rest_seconds":150},{"exercise_name":"Overhead Press (OHP)","sets":3,"reps":"8-10","rest_seconds":120},{"exercise_name":"Barbell Curl","sets":2,"reps":"10-12","rest_seconds":90},{"exercise_name":"Tricep Pushdown","sets":2,"reps":"10-12","rest_seconds":90},{"exercise_name":"Plank","sets":3,"reps":"30-45s","rest_seconds":60}]},{"day_number":2,"label":"Full Body B","muscle_groups":["Full Body"],"exercises":[{"exercise_name":"Deadlift","sets":3,"reps":"6-8","rest_seconds":210},{"exercise_name":"Incline Dumbbell Press","sets":3,"reps":"8-12","rest_seconds":120},{"exercise_name":"Pull-Up","sets":3,"reps":"5-8","rest_seconds":150},{"exercise_name":"Lateral Raise","sets":3,"reps":"12-15","rest_seconds":60},{"exercise_name":"Romanian Deadlift","sets":3,"reps":"10-12","rest_seconds":120},{"exercise_name":"Standing Calf Raise","sets":3,"reps":"15","rest_seconds":60},{"exercise_name":"Crunch","sets":3,"reps":"15-20","rest_seconds":60}]},{"day_number":3,"label":"Full Body C","muscle_groups":["Full Body"],"exercises":[{"exercise_name":"Front Squat","sets":3,"reps":"8-10","rest_seconds":180},{"exercise_name":"Dumbbell Bench Press","sets":3,"reps":"10-12","rest_seconds":120},{"exercise_name":"Seated Cable Row","sets":3,"reps":"10-12","rest_seconds":120},{"exercise_name":"Arnold Press","sets":3,"reps":"10-12","rest_seconds":90},{"exercise_name":"Dumbbell Curl","sets":2,"reps":"12-15","rest_seconds":60},{"exercise_name":"Skull Crusher","sets":2,"reps":"12-15","rest_seconds":60},{"exercise_name":"Hip Thrust","sets":3,"reps":"12-15","rest_seconds":90}]}]'
)
ON CONFLICT DO NOTHING;
