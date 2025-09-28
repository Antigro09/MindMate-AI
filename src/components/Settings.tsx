import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Gear, Download, Upload, Trash, Shield } from '@phosphor-icons/react'
import { AppView, UserSettings } from '@/lib/types'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { CrisisTestDialog } from './CrisisTestDialog'

interface SettingsProps {
  onNavigate: (view: AppView) => void
}

export function Settings({ onNavigate }: SettingsProps) {
  const [settings, setSettings] = useKV<UserSettings>('user-settings', {
    darkMode: false,
    notifications: true,
    dataRetention: 365,
    aiResponses: true
  })
  
  const [journalEntries] = useKV<any[]>('journal-entries', [])
  const [moodEntries] = useKV<any[]>('mood-entries', [])
  const [showConfirmReset, setShowConfirmReset] = useState(false)

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(current => ({ 
      darkMode: false,
      notifications: true,
      dataRetention: 365,
      aiResponses: true,
      ...(current || {}), 
      [key]: value 
    }))
    toast.success('Setting updated')
  }

  const exportData = () => {
    const data = {
      journalEntries: journalEntries || [],
      moodEntries: moodEntries || [],
      settings: settings || {},
      exportDate: new Date().toISOString(),
      version: '1.0'
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mindmate-backup-${new Date().toLocaleDateString().replace(/\//g, '-')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Data exported successfully')
  }

  const importData = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          
          if (data.journalEntries) {
            await window.spark.kv.set('journal-entries', data.journalEntries)
          }
          if (data.moodEntries) {
            await window.spark.kv.set('mood-entries', data.moodEntries)
          }
          if (data.settings) {
            await window.spark.kv.set('user-settings', data.settings)
          }
          
          toast.success('Data imported successfully. Please refresh the app.')
        } catch (error) {
          toast.error('Failed to import data. Please check the file format.')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const resetAllData = async () => {
    try {
      await window.spark.kv.delete('journal-entries')
      await window.spark.kv.delete('mood-entries')
      await window.spark.kv.delete('generated-insights')
      await window.spark.kv.delete('completed-exercises')
      
      setShowConfirmReset(false)
      toast.success('All data has been reset')
    } catch (error) {
      toast.error('Failed to reset data')
    }
  }

  const getTotalEntries = () => {
    return (journalEntries || []).length + (moodEntries || []).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('home')}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Gear className="w-6 h-6 text-primary" weight="regular" />
            <h1 className="text-2xl font-semibold">Settings</h1>
          </div>
        </div>

        <div className="space-y-6">
          {/* Privacy & Data */}
          <Card className="bg-card/70 backdrop-blur-sm border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Privacy & Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">AI Responses</div>
                  <div className="text-sm text-muted-foreground">
                    Enable AI-powered insights for journal entries
                  </div>
                </div>
                <Switch
                  checked={settings?.aiResponses ?? true}
                  onCheckedChange={(checked) => updateSetting('aiResponses', checked)}
                />
              </div>
              <div className="bg-muted/20 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">
                  <div className="font-medium mb-1">🔒 Your Privacy Matters</div>
                  All your data is stored locally on your device. Nothing is sent to external servers 
                  except for AI processing, which is done securely and doesn't store your personal information.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="bg-card/70 backdrop-blur-sm border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                You have {getTotalEntries()} total entries (journal + mood logs)
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={exportData}
                  className="gap-2 hover:bg-primary/10"
                >
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
                <Button
                  variant="outline"
                  onClick={importData}
                  className="gap-2 hover:bg-primary/10"
                >
                  <Upload className="w-4 h-4" />
                  Import Data
                </Button>
              </div>

              <div className="pt-4 border-t border-border/50">
                {!showConfirmReset ? (
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmReset(true)}
                    className="w-full gap-2 text-destructive border-destructive/20 hover:bg-destructive/10"
                  >
                    <Trash className="w-4 h-4" />
                    Reset All Data
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="text-sm text-destructive font-medium text-center">
                      ⚠️ This will permanently delete all your data
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowConfirmReset(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={resetAllData}
                      >
                        Confirm Reset
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card className="bg-card/70 backdrop-blur-sm border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>About MindMate AI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">
                  MindMate AI is your private mental health companion, designed to support your 
                  emotional wellbeing through journaling, mood tracking, and mindfulness exercises.
                </p>
                <p className="mb-2">
                  <strong>Key Features:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Private journaling with AI insights</li>
                  <li>Daily mood tracking and patterns</li>
                  <li>Guided mindfulness exercises</li>
                  <li>Personal wellness insights</li>
                  <li>Crisis intervention detection</li>
                  <li>Complete offline functionality</li>
                </ul>
                <p className="mt-4 text-xs">
                  Version 1.0 • Built with care for your mental health journey
                </p>
                
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="text-xs text-muted-foreground mb-2">Development Tools:</div>
                  <CrisisTestDialog />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}