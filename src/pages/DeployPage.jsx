import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Server,
  Cloud,
  Shield,
  CheckCircle2,
  Loader2,
  Mail,
  Lock,
  Zap,
} from 'lucide-react';

export default function DeployPage({ onBack }) {
  const [step, setStep] = useState('config');

  const [progress, setProgress] = useState(0);
  const [serverType, setServerType] = useState('');
  const [region, setRegion] = useState('');
  const navigate = useNavigate();


  const handleDeploy = () => {
    setStep('deploying');
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => setStep('complete'), 500);
      }
    }, 400);
  };

  const deploymentSteps = [
    { icon: Server, label: 'Initializing mail server layer', delay: 0 },
    { icon: Shield, label: 'Setting up AI threat detection', delay: 0.2 },
    { icon: Cloud, label: 'Deploying to Azure AKS', delay: 0.4 },
    { icon: Lock, label: 'Configuring sandbox environment', delay: 0.6 },
    { icon: Zap, label: 'Activating real-time monitoring', delay: 0.8 },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent"
              style={{ left: `${i * 5}%` }}
              animate={{
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 px-8 py-8">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>


        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="mb-4">Deploy CyberShield</h1>
            <p className="text-muted-foreground">
              Configure and deploy your email security layer in minutes
            </p>
          </motion.div>

          {step === 'config' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Deployment Configuration</CardTitle>
                  <CardDescription>
                    Select your mail server type and deployment region
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Mail Server Type</Label>
                      <Select value={serverType} onValueChange={setServerType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select server type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="exchange">Microsoft Exchange</SelectItem>
                          <SelectItem value="office365">Office 365</SelectItem>
                          <SelectItem value="gmail">Google Workspace</SelectItem>
                          <SelectItem value="postfix">Postfix</SelectItem>
                          <SelectItem value="sendmail">Sendmail</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Azure Region</Label>
                      <Select value={region} onValueChange={setRegion}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eastus">East US</SelectItem>
                          <SelectItem value="westus">West US</SelectItem>
                          <SelectItem value="northeurope">North Europe</SelectItem>
                          <SelectItem value="westeurope">West Europe</SelectItem>
                          <SelectItem value="southeastasia">Southeast Asia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>API Key</Label>
                      <Input type="text" placeholder="Enter your API key" />
                    </div>

                    <div className="space-y-2">
                      <Label>Domain</Label>
                      <Input type="text" placeholder="example.com" />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="mb-4">Deployment Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { icon: Shield, label: 'AI Threat Detection', color: 'text-chart-1' },
                        { icon: Lock, label: 'Sandbox Analysis', color: 'text-chart-2' },
                        { icon: Zap, label: 'Real-time Monitoring', color: 'text-chart-3' },
                      ].map((feature, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                        >
                          <feature.icon className={`h-5 w-5 ${feature.color}`} />
                          <span className="text-sm">{feature.label}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleDeploy}
                    disabled={!serverType || !region}
                  >
                    <Cloud className="mr-2 h-5 w-5" />
                    Deploy Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 'deploying' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    Deploying CyberShield
                  </CardTitle>
                  <CardDescription>
                    Setting up your email security infrastructure...
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Deployment Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    {deploymentSteps.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: item.delay }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                      >
                        <motion.div
                          animate={{
                            scale: progress >= (i + 1) * 20 ? [1, 1.2, 1] : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <item.icon
                            className={`h-5 w-5 ${
                              progress >= (i + 1) * 20 ? 'text-green-500' : 'text-muted-foreground'
                            }`}
                          />
                        </motion.div>
                        <span className="flex-1">{item.label}</span>
                        {progress >= (i + 1) * 20 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                          >
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 'complete' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="pt-6 text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="mx-auto w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </motion.div>

                  <div>
                    <h2 className="mb-2">Deployment Successful!</h2>
                    <p className="text-muted-foreground">
                      CyberShield is now protecting your email infrastructure
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <Mail className="h-6 w-6 text-chart-1 mx-auto mb-2" />
                      <div className="text-sm text-muted-foreground">Emails Scanned</div>
                      <div className="text-2xl">0</div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <Shield className="h-6 w-6 text-chart-2 mx-auto mb-2" />
                      <div className="text-sm text-muted-foreground">Threats Blocked</div>
                      <div className="text-2xl">0</div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <Zap className="h-6 w-6 text-chart-3 mx-auto mb-2" />
                      <div className="text-sm text-muted-foreground">Status</div>
                      <Badge variant="default" className="bg-green-500">Active</Badge>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button className="flex-1" onClick={() => navigate('/')}>
                      Back to Home
                    </Button>
                    <Button variant="outline" className="flex-1">
                      View Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
