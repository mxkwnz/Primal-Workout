const Workout = require('../models/Workout');

const TARGETS = ['loose_fat', 'gain_muscle', 'become_calisthenic', 'body_builders_plan', 'athletes_plan', 'power_lifters_plan'];
const DIFFICULTIES = ['beginner', 'intermediate', 'hard', 'olympic_champion'];

const planTemplates = {
    loose_fat: {
        beginner: { name: 'Fat Loss Starter', desc: 'Light cardio and full-body moves to burn calories.', exercises: [{ name: 'Jumping Jacks', sets: 3, reps: '45s', rest: 45 }, { name: 'Bodyweight Squats', sets: 3, reps: '12', rest: 50 }, { name: 'March in Place', sets: 3, reps: '60s', rest: 45 }, { name: 'Plank', sets: 3, reps: '20s', rest: 45 }] },
        intermediate: { name: 'Fat Burn Circuit', desc: 'Higher intensity circuit to boost metabolism.', exercises: [{ name: 'Burpees', sets: 3, reps: '10', rest: 45 }, { name: 'High Knees', sets: 3, reps: '45s', rest: 40 }, { name: 'Mountain Climbers', sets: 3, reps: '30', rest: 40 }, { name: 'Jump Squats', sets: 3, reps: '12', rest: 50 }] },
        hard: { name: 'HIIT Shred', desc: 'High-intensity intervals for maximum fat burn.', exercises: [{ name: 'Burpees', sets: 4, reps: '15', rest: 30 }, { name: 'Sprint in Place', sets: 4, reps: '30s', rest: 30 }, { name: 'Mountain Climbers', sets: 4, reps: '40', rest: 30 }, { name: 'Jump Lunges', sets: 4, reps: '12/leg', rest: 35 }] },
        olympic_champion: { name: 'Elite Fat Destroyer', desc: 'Competition-level conditioning and calorie burn.', exercises: [{ name: 'Burpees + Jump', sets: 5, reps: '20', rest: 25 }, { name: 'Battle Ropes (or High Knees max)', sets: 5, reps: '45s', rest: 25 }, { name: 'Box Jumps', sets: 5, reps: '15', rest: 30 }, { name: 'Sprawls', sets: 5, reps: '25', rest: 25 }] },
    },
    gain_muscle: {
        beginner: { name: 'Muscle Building Basics', desc: 'Fundamental compound movements with moderate volume.', exercises: [{ name: 'Push-ups', sets: 3, reps: '10', rest: 75 }, { name: 'Goblet Squats', sets: 3, reps: '12', rest: 75 }, { name: 'Dumbbell Rows', sets: 3, reps: '12', rest: 75 }, { name: 'Glute Bridge', sets: 3, reps: '15', rest: 60 }] },
        intermediate: { name: 'Hypertrophy Builder', desc: 'Classic 8–12 rep range for muscle growth.', exercises: [{ name: 'Bench Press', sets: 4, reps: '8-12', rest: 90 }, { name: 'Squats', sets: 4, reps: '8-12', rest: 90 }, { name: 'Deadlifts', sets: 3, reps: '8', rest: 120 }, { name: 'Overhead Press', sets: 3, reps: '8-12', rest: 90 }] },
        hard: { name: 'Advanced Mass Plan', desc: 'High volume and intensity for experienced lifters.', exercises: [{ name: 'Bench Press', sets: 5, reps: '6-10', rest: 120 }, { name: 'Back Squat', sets: 5, reps: '6-10', rest: 120 }, { name: 'Romanian Deadlift', sets: 4, reps: '8', rest: 100 }, { name: 'Pull-ups', sets: 4, reps: '8-12', rest: 90 }] },
        olympic_champion: { name: 'Elite Bodybuilding Split', desc: 'Peak-volume, competition-style programming.', exercises: [{ name: 'Bench (heavy)', sets: 6, reps: '4-6', rest: 150 }, { name: 'Squat (heavy)', sets: 6, reps: '4-6', rest: 180 }, { name: 'Deadlift (heavy)', sets: 4, reps: '4-5', rest: 180 }, { name: 'Accessory (dropsets)', sets: 4, reps: '10-15', rest: 60 }] },
    },
    become_calisthenic: {
        beginner: { name: 'Calisthenics Foundations', desc: 'Basic push, pull, and leg bodyweight moves.', exercises: [{ name: 'Wall Push-ups', sets: 3, reps: '12', rest: 60 }, { name: 'Assisted Squats', sets: 3, reps: '12', rest: 60 }, { name: 'Dead Hang', sets: 3, reps: '20s', rest: 60 }, { name: 'Plank Hold', sets: 3, reps: '30s', rest: 45 }] },
        intermediate: { name: 'Street Workout Intro', desc: 'Pull-ups, dips, and pistol progressions.', exercises: [{ name: 'Pull-ups', sets: 3, reps: '8', rest: 75 }, { name: 'Push-ups', sets: 3, reps: '15', rest: 60 }, { name: 'Dips (assisted if needed)', sets: 3, reps: '10', rest: 75 }, { name: 'Lunges', sets: 3, reps: '12/leg', rest: 60 }] },
        hard: { name: 'Advanced Calisthenics', desc: 'Muscle-ups, levers, and high-skill progressions.', exercises: [{ name: 'Muscle-up progressions', sets: 4, reps: '5', rest: 120 }, { name: 'Pistol Squats', sets: 4, reps: '6/leg', rest: 90 }, { name: 'Front Lever progressions', sets: 4, reps: '8', rest: 90 }, { name: 'Handstand Push-up progressions', sets: 4, reps: '8', rest: 90 }] },
        olympic_champion: { name: 'Elite Calisthenics', desc: 'Full planche, front lever, one-arm pull-ups.', exercises: [{ name: 'Planche progressions', sets: 5, reps: '10s', rest: 120 }, { name: 'Front Lever', sets: 5, reps: '8', rest: 120 }, { name: 'One-Arm Pull-up progressions', sets: 4, reps: '5', rest: 120 }, { name: 'Handstand Push-ups', sets: 4, reps: '10', rest: 90 }] },
    },
    body_builders_plan: {
        beginner: { name: 'Bodybuilding 101', desc: 'Classic bro-split style introduction.', exercises: [{ name: 'Chest Press', sets: 3, reps: '12', rest: 75 }, { name: 'Lat Pulldown', sets: 3, reps: '12', rest: 75 }, { name: 'Leg Press', sets: 3, reps: '15', rest: 75 }, { name: 'Curls', sets: 3, reps: '12', rest: 60 }] },
        intermediate: { name: 'Classic Bodybuilding', desc: 'Higher volume, 8–12 rep focus.', exercises: [{ name: 'Bench', sets: 4, reps: '8-12', rest: 90 }, { name: 'Rows', sets: 4, reps: '8-12', rest: 90 }, { name: 'Squats', sets: 4, reps: '10', rest: 90 }, { name: 'OHP', sets: 3, reps: '8-12', rest: 90 }, { name: 'Isolation (bis/tris)', sets: 3, reps: '12', rest: 60 }] },
        hard: { name: 'Advanced Bodybuilding', desc: 'Periodized volume and intensity.', exercises: [{ name: 'Heavy compound (chest/back/legs)', sets: 5, reps: '6-8', rest: 120 }, { name: 'Hypertrophy accessories', sets: 4, reps: '10-15', rest: 75 }, { name: 'Dropsets / supersets', sets: 3, reps: '12', rest: 60 }] },
        olympic_champion: { name: 'Pro Bodybuilding Prep', desc: 'Peak volume and conditioning for stage.', exercises: [{ name: 'Competition-style split', sets: 6, reps: '6-12', rest: 90 }, { name: 'High-rep finishers', sets: 4, reps: '15-20', rest: 60 }, { name: 'Cardio finisher', sets: 1, reps: '20min', rest: 0 }] },
    },
    athletes_plan: {
        beginner: { name: 'Athlete Foundations', desc: 'Mobility, stability, and basic power.', exercises: [{ name: 'Dynamic Warm-up', sets: 1, reps: '5min', rest: 0 }, { name: 'Bodyweight Squats', sets: 3, reps: '12', rest: 60 }, { name: 'Lunges', sets: 3, reps: '10/leg', rest: 60 }, { name: 'Plank', sets: 3, reps: '30s', rest: 45 }] },
        intermediate: { name: 'Sport Performance', desc: 'Power, agility, and conditioning.', exercises: [{ name: 'Box Jumps', sets: 4, reps: '8', rest: 90 }, { name: 'Medicine Ball Throws', sets: 4, reps: '10', rest: 75 }, { name: 'Sprints', sets: 4, reps: '20s', rest: 90 }, { name: 'Core circuit', sets: 3, reps: '45s', rest: 45 }] },
        hard: { name: 'Elite Athletic Performance', desc: 'Max power and sport-specific work.', exercises: [{ name: 'Olympic lift variations', sets: 5, reps: '5', rest: 120 }, { name: 'Plyometrics', sets: 4, reps: '8', rest: 90 }, { name: 'Conditioning intervals', sets: 5, reps: '60s', rest: 60 }] },
        olympic_champion: { name: 'Olympic Athlete Program', desc: 'Peak power and recovery protocols.', exercises: [{ name: 'Snatch / Clean & Jerk', sets: 6, reps: '3-5', rest: 180 }, { name: 'Max power sprints', sets: 6, reps: '15s', rest: 120 }, { name: 'Sport-specific drills', sets: 5, reps: '90s', rest: 90 }] },
    },
    power_lifters_plan: {
        beginner: { name: 'Powerlifting Basics', desc: 'Learn squat, bench, deadlift form.', exercises: [{ name: 'Squat', sets: 3, reps: '8', rest: 120 }, { name: 'Bench Press', sets: 3, reps: '8', rest: 120 }, { name: 'Deadlift', sets: 3, reps: '6', rest: 120 }] },
        intermediate: { name: 'Strength Builder', desc: 'Linear progression on the big three.', exercises: [{ name: 'Squat', sets: 4, reps: '5', rest: 180 }, { name: 'Bench', sets: 4, reps: '5', rest: 180 }, { name: 'Deadlift', sets: 3, reps: '5', rest: 180 }, { name: 'Accessories', sets: 3, reps: '10', rest: 90 }] },
        hard: { name: 'Advanced Powerlifting', desc: 'Periodized programming for the big three.', exercises: [{ name: 'Squat (heavy)', sets: 5, reps: '3-5', rest: 240 }, { name: 'Bench (heavy)', sets: 5, reps: '3-5', rest: 240 }, { name: 'Deadlift (heavy)', sets: 4, reps: '3', rest: 240 }] },
        olympic_champion: { name: 'Elite Powerlifting', desc: 'Peak strength and competition prep.', exercises: [{ name: 'Competition Squat', sets: 6, reps: '1-3', rest: 300 }, { name: 'Competition Bench', sets: 6, reps: '1-3', rest: 300 }, { name: 'Competition Deadlift', sets: 5, reps: '1-3', rest: 300 }] },
    },
};

async function seedWorkoutPlans() {
    const existing = await Workout.countDocuments({ createdBy: null, accessLevel: 'free' });
    if (existing > 0) return;
    const toInsert = [];
    for (const target of TARGETS) {
        const template = planTemplates[target];
        if (!template) continue;
        for (const difficulty of DIFFICULTIES) {
            const t = template[difficulty];
            if (!t) continue;
            toInsert.push({
                name: t.name,
                description: t.desc,
                target,
                difficulty,
                accessLevel: 'free',
                createdBy: null,
                exercises: t.exercises.map(e => ({
                    name: e.name,
                    sets: e.sets,
                    reps: e.reps,
                    rest: e.rest || 60
                }))
            });
        }
    }
    if (toInsert.length) await Workout.insertMany(toInsert);
}

module.exports = seedWorkoutPlans;
