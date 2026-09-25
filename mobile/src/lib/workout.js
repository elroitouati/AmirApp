// לוגיקת האימון הפעיל. כל הזמנים נשמרים כ-timestamps (Date.now()),
// כך שהטיימרים נשארים מדויקים גם כשהמסך כבוי או האפליקציה ברקע.

export function createWorkout(program, now = Date.now()) {
  return {
    id: String(now),
    startedAt: now,
    phase: 'warmup', // warmup | exercise | summary
    warmupStartedAt: now,
    warmupDurationMs: program.warmup.durationSec * 1000,
    warmupMs: null,
    exercises: program.exercises.map(({ id, name }) => ({ id, name })),
    currentIndex: 0,
    exerciseStartedAt: null,
    completed: [],
    endedAt: null,
    endedEarly: false,
  }
}

export const warmupEndsAt = (w) => w.warmupStartedAt + w.warmupDurationMs

export function endWarmup(w, at) {
  if (w.phase !== 'warmup') return w
  return { ...w, phase: 'exercise', warmupMs: at - w.warmupStartedAt, exerciseStartedAt: at }
}

export function finishExercise(w, now = Date.now()) {
  if (w.phase !== 'exercise') return w
  const ex = w.exercises[w.currentIndex]
  const completed = [...w.completed, { id: ex.id, name: ex.name, durationMs: now - w.exerciseStartedAt }]
  if (w.currentIndex >= w.exercises.length - 1) {
    return { ...w, completed, phase: 'summary', endedAt: now, exerciseStartedAt: null }
  }
  return { ...w, completed, currentIndex: w.currentIndex + 1, exerciseStartedAt: now }
}

// סיום מוקדם: שומר רק את התרגילים שהושלמו
export function endEarly(w, now = Date.now()) {
  if (w.phase === 'summary') return w
  return {
    ...w,
    phase: 'summary',
    endedAt: now,
    endedEarly: true,
    warmupMs: w.phase === 'warmup' ? now - w.warmupStartedAt : w.warmupMs,
    exerciseStartedAt: null,
  }
}

export function toHistoryEntry(w) {
  return {
    id: w.id,
    startedAt: w.startedAt,
    endedAt: w.endedAt,
    durationMs: w.endedAt - w.startedAt,
    warmupMs: w.warmupMs ?? 0,
    exercises: w.completed,
    totalExercises: w.exercises.length,
    endedEarly: w.endedEarly,
  }
}
