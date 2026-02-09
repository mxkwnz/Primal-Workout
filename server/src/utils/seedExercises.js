const Exercise = require('../models/Exercise');

const defaultExercises = [
    { name: 'Bench Press', muscleGroups: ['chest', 'triceps'], equipment: ['barbell', 'bench'], difficulty: 'intermediate', type: 'strength', instructions: 'Lie on bench, grip bar, lower to chest, press up.', tags: ['compound', 'push'] },
    { name: 'Squat', muscleGroups: ['quadriceps', 'glutes', 'hamstrings'], equipment: ['barbell'], difficulty: 'beginner', type: 'strength', instructions: 'Bar on upper back, squat down until thighs parallel, stand.', tags: ['compound', 'legs'] },
    { name: 'Deadlift', muscleGroups: ['back', 'hamstrings', 'glutes'], equipment: ['barbell'], difficulty: 'intermediate', type: 'strength', instructions: 'Hinge at hips, grip bar, drive through heels to stand.', tags: ['compound', 'pull'] },
    { name: 'Push-ups', muscleGroups: ['chest', 'triceps'], equipment: ['bodyweight'], difficulty: 'beginner', type: 'strength', instructions: 'Hands under shoulders, lower chest to floor, push back up.', tags: ['bodyweight', 'push'] },
    { name: 'Pull-ups', muscleGroups: ['back', 'biceps'], equipment: ['pull-up bar'], difficulty: 'intermediate', type: 'strength', instructions: 'Hang from bar, pull until chin over bar, lower with control.', tags: ['bodyweight', 'pull'] },
    { name: 'Overhead Press', muscleGroups: ['shoulders', 'triceps'], equipment: ['barbell', 'dumbbell'], difficulty: 'beginner', type: 'strength', instructions: 'Press weight from shoulders to overhead, lock out.', tags: ['compound', 'push'] },
    { name: 'Lunges', muscleGroups: ['quadriceps', 'glutes'], equipment: ['bodyweight', 'dumbbell'], difficulty: 'beginner', type: 'strength', instructions: 'Step forward, lower back knee toward floor, push back up.', tags: ['legs'] },
    { name: 'Plank', muscleGroups: ['core'], equipment: ['bodyweight'], difficulty: 'beginner', type: 'strength', instructions: 'Hold push-up position with arms straight, core tight.', tags: ['core', 'isometric'] },
    { name: 'Burpees', muscleGroups: ['full body'], equipment: ['bodyweight'], difficulty: 'intermediate', type: 'cardio', instructions: 'Squat, kick feet back, push-up, jump feet in, jump up.', tags: ['cardio', 'hiit'] },
    { name: 'Dumbbell Rows', muscleGroups: ['back', 'biceps'], equipment: ['dumbbell'], difficulty: 'beginner', type: 'strength', instructions: 'Support on bench, row dumbbell to hip.', tags: ['pull'] },
    { name: 'Jump Squats', muscleGroups: ['quadriceps', 'glutes'], equipment: ['bodyweight'], difficulty: 'beginner', type: 'cardio', instructions: 'Squat down, explode up into a jump, land softly.', tags: ['plyometric'] },
    { name: 'Mountain Climbers', muscleGroups: ['core', 'shoulders'], equipment: ['bodyweight'], difficulty: 'beginner', type: 'cardio', instructions: 'In plank, drive knees toward chest alternately.', tags: ['cardio', 'core'] }
];

async function seedExercises() {
    const count = await Exercise.countDocuments();
    if (count > 0) return;
    await Exercise.insertMany(defaultExercises);
}

module.exports = seedExercises;
