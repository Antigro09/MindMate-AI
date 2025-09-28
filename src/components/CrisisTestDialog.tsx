import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { detectCrisisIndicators } from '@/lib/crisis-detection'
import { CrisisDetection } from '@/lib/types'
import { CrisisResourcesAlert } from './CrisisResourcesAlert'
import { Warning } from '@phosphor-icons/react'

export function CrisisTestDialog() {
  const [testInput, setTestInput] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<CrisisDetection | null>(null)

  const testSamples = [
    "I'm feeling really overwhelmed and stressed out",
    "I don't see the point in anything anymore and feel hopeless",
    "I've been thinking about hurting myself lately",
    "Just checking in, had a good day today"
  ]

  const analyzeText = async (text: string) => {
    setIsAnalyzing(true)
    try {
      const detection = await detectCrisisIndicators(text)
      setResult(detection)
    } catch (error) {
      console.error('Crisis detection failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'severe':
        return 'bg-red-600 text-white'
      case 'high':
        return 'bg-red-500 text-white'
      case 'moderate':
        return 'bg-yellow-500 text-white'
      default:
        return 'bg-green-500 text-white'
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Warning size={16} />
          Test Crisis Detection
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crisis Detection System Test</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Test Crisis Detection with Sample Text:
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {testSamples.map((sample, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTestInput(sample)
                    analyzeText(sample)
                  }}
                  className="text-left h-auto p-2 text-xs"
                >
                  "{sample.slice(0, 30)}..."
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Or Enter Custom Text:
            </label>
            <Textarea
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Enter text to analyze for crisis indicators..."
              className="min-h-[100px]"
            />
            <Button
              onClick={() => analyzeText(testInput)}
              disabled={!testInput.trim() || isAnalyzing}
              className="mt-2"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Text'}
            </Button>
          </div>

          {result && (
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">Detection Result:</span>
                <Badge className={getRiskLevelColor(result.riskLevel)}>
                  {result.isDetected ? `${result.riskLevel.toUpperCase()} RISK` : 'NO CRISIS DETECTED'}
                </Badge>
              </div>

              {result.isDetected && (
                <CrisisResourcesAlert
                  crisisDetection={result}
                  onDismiss={() => setResult(null)}
                  className="mt-3"
                />
              )}

              {!result.isDetected && (
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-green-800 text-sm">
                    ✅ No crisis indicators detected. This text appears to be within normal emotional range.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}