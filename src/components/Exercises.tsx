import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Leaf, Play, Check, Clock } from '@phosphor-icons/react'
import { AppView, Exercise } from '@/lib/types'
import { EXERCISES } from '@/lib/exercises-data'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface ExercisesProps {
  onNavigate: (view: AppView) => void
}

export function Exercises({ onNavigate }: ExercisesProps) {
  const [completedExercises, setCompletedExercises] = useKV<Record<string, number>>('completed-exercises', {})
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [isCompleting, setIsCompleting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const getCategoryColor = (category: Exercise['category']) => {
    switch (category) {
      case 'breathing': return 'bg-blue-100 text-blue-800'
      case 'meditation': return 'bg-purple-100 text-purple-800'
      case 'cbt': return 'bg-green-100 text-green-800'
      case 'grounding': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: Exercise['category']) => {
    switch (category) {
      case 'breathing': return '🫁'
      case 'meditation': return '🧘'
      case 'cbt': return '🧠'
      case 'grounding': return '🌱'
      default: return '✨'
    }
  }

  const handleCompleteExercise = (exerciseId: string) => {
    const current = completedExercises || {}
    const newCount = (current[exerciseId] || 0) + 1
    setCompletedExercises({ ...current, [exerciseId]: newCount })
    setSelectedExercise(null)
    setIsCompleting(false)
    setCurrentStep(0)
    toast.success('Exercise completed! Great job! 🎉')
  }

  const startExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise)
    setIsCompleting(true)
    setCurrentStep(0)
  }

  const nextStep = () => {
    if (selectedExercise && currentStep < selectedExercise.instructions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else if (selectedExercise) {
      handleCompleteExercise(selectedExercise.id)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (isCompleting && selectedExercise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-secondary/5">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setIsCompleting(false)
                setSelectedExercise(null)
                setCurrentStep(0)
              }}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-semibold">{selectedExercise.title}</h1>
          </div>

          <Card className="bg-card/70 backdrop-blur-sm border-border/50 shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">
                  Step {currentStep + 1} of {selectedExercise.instructions.length}
                </CardTitle>
                <Badge variant="outline" className={getCategoryColor(selectedExercise.category)}>
                  {getCategoryIcon(selectedExercise.category)} {selectedExercise.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-secondary/10 p-6 rounded-lg">
                <p className="text-lg leading-relaxed text-center">
                  {selectedExercise.instructions[currentStep]}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                
                <div className="flex gap-2">
                  {selectedExercise.instructions.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index <= currentStep ? 'bg-secondary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  onClick={nextStep}
                  className="gap-2"
                >
                  {currentStep === selectedExercise.instructions.length - 1 ? (
                    <>
                      <Check className="w-4 h-4" />
                      Complete
                    </>
                  ) : (
                    'Next'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-secondary/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('home')}
            className="hover:bg-secondary/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-secondary" weight="regular" />
            <h1 className="text-2xl font-semibold">Mindfulness Exercises</h1>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-muted-foreground">
            Take a moment for yourself with these guided exercises designed to help you feel more centered and calm.
          </p>
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EXERCISES.map((exercise) => {
            const completionCount = (completedExercises || {})[exercise.id] || 0
            
            return (
              <Card 
                key={exercise.id}
                className="group hover:shadow-xl transition-all duration-300 bg-card/70 backdrop-blur-sm border-border/50 hover:border-secondary/20"
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getCategoryIcon(exercise.category)}</span>
                      <CardTitle className="text-lg group-hover:text-secondary transition-colors">
                        {exercise.title}
                      </CardTitle>
                    </div>
                    <Badge variant="outline" className={getCategoryColor(exercise.category)}>
                      {exercise.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {exercise.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {exercise.duration} min
                    </div>
                    {completionCount > 0 && (
                      <div className="flex items-center gap-1">
                        <Check className="w-4 h-4 text-secondary" />
                        Completed {completionCount} time{completionCount > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => startExercise(exercise)}
                    className="w-full gap-2 group-hover:bg-secondary group-hover:text-secondary-foreground"
                  >
                    <Play className="w-4 h-4" />
                    Start Exercise
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}