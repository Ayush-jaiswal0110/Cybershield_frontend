import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
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
  Box,
  Container,
  Network,
  Activity,
  FileCheck,
  Globe,
  AlertCircle,
} from 'lucide-react';


// Docker Logo SVG Component
const DockerLogo = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 10.5h2.25v2.25H13.5V10.5zm-3 0h2.25v2.25H10.5V10.5zm-3 0h2.25v2.25H7.5V10.5zm6-3h2.25v2.25H13.5V7.5zm-3 0h2.25v2.25H10.5V7.5zm6 3h2.25v2.25H16.5V10.5zm-3-6h2.25v2.25H13.5V4.5z" fill="currentColor" />
    <path d="M21.5 11.5c-.3-.2-1.5-.8-2.9-.6-.3-2.3-2.1-3.4-2.2-3.5l-.5-.3-.3.5c-.4.6-.7 1.4-.7 2.2 0 .5.1 1 .3 1.4-1 .6-2.5.6-2.8.6H2.5l-.1.6c-.2 1.5.1 3.6 1.5 5.4 1.2 1.5 3 2.2 5.3 2.2 5.1 0 8.9-2.4 10.7-6.7.7 0 2.2 0 3-1.5.1-.1.2-.3.3-.5l-.2-.2c-.4-.3-1.3-.9-1.5-1z" fill="currentColor" opacity="0.7" />
  </svg>
);

// Kubernetes Logo SVG Component
const KubernetesLogo = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3l9 5.2v10.6L12 24l-9-5.2V8.2L12 3z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <path d="M12 7v3M17 9.5l-2.6 1.5M17 14.5l-2.6-1.5M12 17v-3M7 14.5l2.6-1.5M7 9.5l2.6 1.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export default function DeployPage() {
  const [step, setStep] = useState('config');
  const [progress, setProgress] = useState(0);
  const [serverType, setServerType] = useState('');
  const [region, setRegion] = useState('');
  const [currentPhase, setCurrentPhase] = useState(0);
  const navigate = useNavigate();

  const handleDeploy = () => {
    setStep('containerizing');
    setProgress(0);
    setCurrentPhase(0);

    // Phase 1: Containerization
    setTimeout(() => {
      let containerProgress = 0;
      const containerInterval = setInterval(() => {
        containerProgress += 20;
        setProgress(containerProgress);
        if (containerProgress >= 100) {
          clearInterval(containerInterval);
          setTimeout(() => {
            setStep('orchestrating');
            setProgress(0);

            // Phase 2: Orchestration
            let orchestrateProgress = 0;
            const orchestrateInterval = setInterval(() => {
              orchestrateProgress += 16.67;
              setProgress(orchestrateProgress);
              if (orchestrateProgress >= 100) {
                clearInterval(orchestrateInterval);
                setTimeout(() => {
                  setStep('emailflow');
                  setProgress(0);

                  // Phase 3: Email Flow
                  let emailProgress = 0;
                  const emailInterval = setInterval(() => {
                    emailProgress += 20;
                    setProgress(emailProgress);
                    if (emailProgress >= 100) {
                      clearInterval(emailInterval);
                      setTimeout(() => setStep('complete'), 500);
                    }
                  }, 500);
                }, 500);
              }
            }, 600);
          }, 500);
        }
      }, 500);
    }, 100);
  };

  const containerizationSteps = [
    { icon: Box, label: 'Building Docker image', color: 'text-blue-500' },
    { icon: Container, label: 'Packaging security modules', color: 'text-blue-600' },
    { icon: Shield, label: 'Embedding AI models', color: 'text-chart-1' },
    { icon: Lock, label: 'Configuring sandbox environment', color: 'text-chart-2' },
    { icon: CheckCircle2, label: 'Container ready for deployment', color: 'text-green-500' },
  ];

  const orchestrationSteps = [
    { icon: Cloud, label: 'Connecting to Azure AKS', color: 'text-blue-500' },
    { icon: Network, label: 'Creating Kubernetes namespace', color: 'text-purple-500' },
    { icon: Box, label: 'Deploying pods across cluster', color: 'text-blue-600' },
    { icon: Activity, label: 'Setting up load balancer', color: 'text-chart-3' },
    { icon: Zap, label: 'Configuring auto-scaling', color: 'text-orange-500' },
    { icon: CheckCircle2, label: 'Orchestration complete', color: 'text-green-500' },
  ];

  const emailFlowSteps = [
    { icon: Mail, label: 'Intercepting incoming email', color: 'text-blue-500' },
    { icon: Shield, label: 'AI threat detection (99.8% accuracy)', color: 'text-chart-1' },
    { icon: Lock, label: 'Sandbox analysis of attachments', color: 'text-chart-2' },
    { icon: Activity, label: 'Real-time monitoring (ms-level)', color: 'text-chart-3' },
    { icon: CheckCircle2, label: 'Email cleared and delivered', color: 'text-green-500' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'AI-Powered Detection',
      description: 'Advanced ML models detect phishing, spam, and malware with 99.8% accuracy in real-time.',
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
    },
    {
      icon: Lock,
      title: 'Sandbox Protection',
      description: 'Suspicious attachments are executed in isolated environments for comprehensive threat analysis.',
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
    },
    {
      icon: Zap,
      title: 'Real-time Monitoring',
      description: 'Millisecond-level threat detection at the mail server layer with instant alerting.',
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
    },
    {
      icon: Globe,
      title: 'Network Intelligence',
      description: 'Global threat intelligence network sharing insights across all deployments.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: FileCheck,
      title: 'Compliance Ready',
      description: 'GDPR, HIPAA, and SOC 2 compliant with detailed audit logs and reporting.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
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
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="mb-4">Deploy CyberSolve</h1>
            <p className="text-muted-foreground">
              Configure and deploy your email security layer with Docker and Kubernetes
            </p>
          </motion.div>

          {/* Configuration Step */}
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
                    <h3 className="mb-4">Protection Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {features.slice(0, 3).map((feature, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className={`p-4 rounded-lg border ${feature.bgColor}`}
                        >
                          <feature.icon className={`h-6 w-6 ${feature.color} mb-2`} />
                          <div className="mb-1">{feature.title}</div>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
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
                    Start Deployment
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Containerization Step */}
          {step === 'containerizing' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <DockerLogo className="w-8 h-8 text-blue-500" />
                    </motion.div>
                    Containerizing with Docker
                  </CardTitle>
                  <CardDescription>
                    Packaging CyberSolve into secure Docker containers...
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Containerization Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Docker Visualization */}
                  <div className="relative h-48 bg-muted/30 rounded-lg p-6 overflow-hidden">
                    <div className="flex items-center justify-center h-full gap-8">
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-center"
                      >
                        <Server className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm">Source Code</p>
                      </motion.div>

                      <motion.div
                        animate={{ x: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowLeft className="h-6 w-6 text-primary rotate-180" />
                      </motion.div>

                      <motion.div
                        animate={{
                          scale: progress > 50 ? [1, 1.1, 1] : 1,
                          rotate: progress > 50 ? [0, 5, -5, 0] : 0,
                        }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                      >
                        <div className="p-6 bg-blue-500/10 rounded-lg border-2 border-blue-500">
                          <DockerLogo className="w-16 h-16 text-blue-500" />
                        </div>
                        {progress > 80 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2"
                          >
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                          </motion.div>
                        )}
                      </motion.div>

                      <motion.div
                        animate={{ x: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                      >
                        <ArrowLeft className="h-6 w-6 text-primary rotate-180" />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: progress > 70 ? 1 : 0.3, x: 0 }}
                        className="text-center"
                      >
                        <Container className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                        <p className="text-sm">Container Image</p>
                      </motion.div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {containerizationSteps.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                      >
                        <motion.div
                          animate={{
                            scale: progress >= (i + 1) * 20 ? [1, 1.2, 1] : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <item.icon
                            className={`h-5 w-5 ${progress >= (i + 1) * 20 ? item.color : 'text-muted-foreground'
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

          {/* Orchestration Step */}
          {step === 'orchestrating' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <KubernetesLogo className="w-8 h-8 text-blue-600" />
                    </motion.div>
                    Orchestrating with Kubernetes
                  </CardTitle>
                  <CardDescription>
                    Deploying to Azure Kubernetes Service (AKS)...
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Orchestration Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Kubernetes Cluster Visualization */}
                  <div className="relative h-64 bg-muted/30 rounded-lg p-6">
                    <div className="text-center mb-4">
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                        <Cloud className="h-3 w-3 mr-1" />
                        Azure AKS Cluster
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6">
                      {[0, 1, 2].map((podIndex) => (
                        <motion.div
                          key={podIndex}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{
                            opacity: progress > podIndex * 25 ? 1 : 0.3,
                            y: progress > podIndex * 25 ? 0 : 20,
                          }}
                          className="relative"
                        >
                          <div className={`p-4 rounded-lg border-2 ${progress > podIndex * 25 ? 'border-blue-500 bg-blue-500/10' : 'border-muted bg-muted/50'
                            }`}>
                            <div className="flex items-center justify-center mb-2">
                              <Box className={`h-8 w-8 ${progress > podIndex * 25 ? 'text-blue-500' : 'text-muted-foreground'
                                }`} />
                            </div>
                            <p className="text-xs text-center">Pod {podIndex + 1}</p>
                            {progress > podIndex * 25 && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-2 -right-2"
                              >
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              </motion.div>
                            )}
                          </div>

                          {progress > 60 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="absolute -bottom-1 left-1/2 -translate-x-1/2"
                            >
                              <Activity className="h-4 w-4 text-green-500" />
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    {progress > 75 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 text-center"
                      >
                        <Badge variant="outline" className="bg-green-500/10 text-green-500">
                          <Network className="h-3 w-3 mr-1" />
                          Load Balancer Active
                        </Badge>
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {orchestrationSteps.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                      >
                        <motion.div
                          animate={{
                            scale: progress >= (i + 1) * 16.67 ? [1, 1.2, 1] : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <item.icon
                            className={`h-5 w-5 ${progress >= (i + 1) * 16.67 ? item.color : 'text-muted-foreground'
                              }`}
                          />
                        </motion.div>
                        <span className="flex-1">{item.label}</span>
                        {progress >= (i + 1) * 16.67 && (
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

          {/* Email Flow Visualization Step */}
          {step === 'emailflow' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Mail className="h-6 w-6 text-primary" />
                    Email Protection Flow
                  </CardTitle>
                  <CardDescription>
                    Understanding how CyberSolve protects your email infrastructure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Testing Email Flow</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Email Flow Diagram */}
                  <div className="relative h-80 bg-muted/30 rounded-lg p-6">
                    <div className="flex flex-col items-center justify-between h-full">
                      {/* Incoming Email */}
                      <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4"
                      >
                        <div className="p-4 bg-blue-500/10 rounded-lg border-2 border-blue-500">
                          <Mail className="h-8 w-8 text-blue-500" />
                        </div>
                        <div>
                          <p>Incoming Email</p>
                          <p className="text-sm text-muted-foreground">From: external@example.com</p>
                        </div>
                      </motion.div>

                      {/* Arrow Down */}
                      <motion.div
                        animate={{ y: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-px h-12 bg-gradient-to-b from-blue-500 to-primary" />
                          <div className="text-primary">↓</div>
                        </div>
                      </motion.div>

                      {/* CyberSolve Protection Layer */}
                      <motion.div
                        animate={{
                          boxShadow: progress > 50
                            ? ['0 0 0 0 rgba(59, 130, 246, 0)', '0 0 0 10px rgba(59, 130, 246, 0)', '0 0 0 0 rgba(59, 130, 246, 0)']
                            : '0 0 0 0 rgba(59, 130, 246, 0)',
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="p-6 bg-gradient-to-r from-chart-1/20 via-chart-2/20 to-chart-3/20 rounded-lg border-2 border-primary"
                      >
                        <div className="flex items-center gap-4">
                          <Shield className="h-12 w-12 text-primary" />
                          <div>
                            <p className="text-lg">CyberSolve Protection</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline" className="bg-chart-1/10 text-chart-1 text-xs">AI Detection</Badge>
                              <Badge variant="outline" className="bg-chart-2/10 text-chart-2 text-xs">Sandbox</Badge>
                              <Badge variant="outline" className="bg-chart-3/10 text-chart-3 text-xs">Monitor</Badge>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Arrow Down */}
                      <motion.div
                        animate={{ y: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-px h-12 bg-gradient-to-b from-primary to-green-500" />
                          <div className="text-green-500">↓</div>
                        </div>
                      </motion.div>

                      {/* User Mail Server */}
                      <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{
                          opacity: progress > 80 ? 1 : 0.5,
                          x: 0,
                        }}
                        className="flex items-center gap-4"
                      >
                        <div className={`p-4 rounded-lg border-2 ${progress > 80 ? 'bg-green-500/10 border-green-500' : 'bg-muted border-muted'
                          }`}>
                          <Server className={`h-8 w-8 ${progress > 80 ? 'text-green-500' : 'text-muted-foreground'}`} />
                        </div>
                        <div>
                          <p>Your Mail Server</p>
                          <p className="text-sm text-muted-foreground">Safe & Delivered ✓</p>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {emailFlowSteps.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                      >
                        <motion.div
                          animate={{
                            scale: progress >= (i + 1) * 20 ? [1, 1.2, 1] : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <item.icon
                            className={`h-5 w-5 ${progress >= (i + 1) * 20 ? item.color : 'text-muted-foreground'
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

          {/* Complete Step */}
          {step === 'complete' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
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
                      CyberSolve is now protecting your email infrastructure
                    </p>
                  </div>

                  {/* Deployment Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20"
                    >
                      <DockerLogo className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-sm text-muted-foreground">Containerization</div>
                      <div className="text-lg">Docker Ready</div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20"
                    >
                      <KubernetesLogo className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-sm text-muted-foreground">Orchestration</div>
                      <div className="text-lg">Kubernetes Active</div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="p-4 bg-green-500/10 rounded-lg border border-green-500/20"
                    >
                      <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <div className="text-sm text-muted-foreground">Protection</div>
                      <Badge variant="default" className="bg-green-500">Active</Badge>
                    </motion.div>
                  </div>

                  {/* Live Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <Mail className="h-6 w-6 text-chart-1 mx-auto mb-2" />
                      <div className="text-sm text-muted-foreground">Emails Scanned</div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-2xl"
                      >
                        0
                      </motion.div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <Shield className="h-6 w-6 text-chart-2 mx-auto mb-2" />
                      <div className="text-sm text-muted-foreground">Threats Blocked</div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-2xl"
                      >
                        0
                      </motion.div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <Activity className="h-6 w-6 text-chart-3 mx-auto mb-2" />
                      <div className="text-sm text-muted-foreground">Detection Rate</div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-2xl"
                      >
                        99.8%
                      </motion.div>
                    </div>
                  </div>

                  {/* All Features */}
                  <div className="pt-4 border-t">
                    <h3 className="mb-4">Active Protection Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {features.map((feature, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className={`p-4 rounded-lg border ${feature.bgColor} text-left`}
                        >
                          <div className="flex items-start gap-3">
                            <feature.icon className={`h-6 w-6 ${feature.color} mt-1`} />
                            <div>
                              <div className="mb-1">{feature.title}</div>
                              <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Home
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => navigate("/login")}>
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
