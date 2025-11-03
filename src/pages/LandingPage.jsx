import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { useTheme } from '../contexts/ThemeProvider';
import {
  Shield,
  Lock,
  Cloud,
  Mail,
  Zap,
  Server,
  Activity,
  AlertTriangle,
  CheckCircle,
  Moon,
  Sun,
  ArrowRight,
  Scan,
  Network,
  FileCheck,
} from 'lucide-react';

// interface LandingPageProps {
//   onNavigate: (page: 'login' | 'deploy') => void;
// }

export default function LandingPage({ onNavigate }) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();


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
      icon: Cloud,
      title: 'Scalable Architecture',
      description: 'Built on Azure AKS with auto-scaling to handle millions of emails per hour.',
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
    },
    {
      icon: Zap,
      title: 'Real-time Monitoring',
      description: 'Millisecond-level threat detection at the mail server layer with instant alerting.',
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
    },
    {
      icon: Network,
      title: 'Network Intelligence',
      description: 'Global threat intelligence network sharing insights across all deployments.',
      color: 'text-chart-5',
      bgColor: 'bg-chart-5/10',
    },
    {
      icon: FileCheck,
      title: 'Compliance Ready',
      description: 'GDPR, HIPAA, and SOC 2 compliant with detailed audit logs and reporting.',
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
    },
  ];

  const stats = [
    { value: '99.8%', label: 'Detection Rate', icon: CheckCircle },
    { value: '<10ms', label: 'Response Time', icon: Zap },
    { value: '10M+', label: 'Emails Protected', icon: Mail },
    { value: '24/7', label: 'Monitoring', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <motion.div
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-chart-1/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Shield className="h-8 w-8 text-primary" />
            </motion.div>
            <h1 className="text-2xl">CyberShield</h1>
          </motion.div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition">
              Features
            </a>
            <a href="#stats" className="text-muted-foreground hover:text-foreground transition">
              Performance
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition">
              About
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </motion.div>
            </Button>
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/deploy')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-6 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Badge variant="secondary" className="mb-2">
              <Zap className="h-3 w-3 mr-1" />
              AI-Powered Email Security
            </Badge>
            <h1 className="text-4xl md:text-6xl leading-tight">
              Intelligent Email Threat{' '}
              <span className="text-primary">Defense System</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              CyberShield uses advanced AI, sandbox analysis, and real-time monitoring to detect and stop
              phishing, spam, and malicious attachments before they reach your inbox.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => navigate('/deploy')}>
                See How It Works
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>

            <div className="flex gap-6 pt-4">
              {stats.slice(0, 2).map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <stat.icon className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-xl">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Animated Email Protection Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-8">
                <div className="space-y-4">
                  {/* Email Scanning Animation */}
                  <div className="relative h-64 flex items-center justify-center">
                    {/* Central Shield */}
                    <motion.div
                      className="absolute z-10"
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                        <Shield className="h-12 w-12 text-primary" />
                      </div>
                    </motion.div>

                    {/* Orbiting Elements */}
                    {[Mail, Lock, Scan].map((Icon, i) => (
                      <motion.div
                        key={i}
                        className="absolute"
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 10 + i * 2,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        style={{
                          width: '100px',
                          height: '100px',
                        }}
                      >
                        <motion.div
                          className="absolute top-0 left-1/2 -translate-x-1/2"
                          animate={{
                            y: [0, -10, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                          }}
                        >
                          <div className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center shadow-lg">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}

                    {/* Scanning Beam */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                      animate={{
                        x: [-300, 300],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      style={{
                        width: '100px',
                      }}
                    />

                    {/* Pulse Rings */}
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="absolute inset-0 border-2 border-primary/30 rounded-full"
                        animate={{
                          scale: [1, 2],
                          opacity: [0.5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.6,
                        }}
                      />
                    ))}
                  </div>

                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                        }}
                      >
                        <Activity className="h-4 w-4 text-green-500" />
                      </motion.div>
                      <span className="text-sm">Real-time Protection Active</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Scanning emails at the mail-server layer
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative bg-muted/30 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <Card className="p-6">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">
            <Server className="h-3 w-3 mr-1" />
            Enterprise Features
          </Badge>
          <h2 className="text-3xl md:text-4xl mb-4">
            Complete Email Security Suite
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Protect your organization with military-grade email security powered by AI and cloud infrastructure.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative bg-muted/30 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three-layer defense system for comprehensive email protection
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Email Interception',
                description: 'All emails are intercepted at the mail server layer before reaching user inboxes',
                icon: Mail,
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Machine learning models analyze content, headers, and attachments in milliseconds',
                icon: Scan,
              },
              {
                step: '03',
                title: 'Threat Response',
                description: 'Malicious emails are quarantined while safe emails are delivered instantly',
                icon: Shield,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <Card className="relative h-full p-6">
                  <div className="text-6xl font-bold text-primary/10 mb-4">{item.step}</div>
                  <item.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl text-center">About CyberShield</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  CyberShield is a next-generation cybersecurity solution designed to integrate directly into
                  your organization's mail-server layer. Built using Docker and Azure Kubernetes Service (AKS),
                  it delivers real-time phishing, malware, and spam detection using AI-based classification
                  and sandbox detonation of suspicious attachments.
                </p>
                <p>
                  Our platform processes millions of emails daily, protecting organizations worldwide from
                  sophisticated cyber threats. With a 99.8% detection rate and sub-10ms response times,
                  CyberShield provides enterprise-grade security without compromising performance.
                </p>
                <div className="grid md:grid-cols-3 gap-4 pt-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Server className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-sm">Docker Containerized</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Cloud className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-sm">Azure AKS Deployed</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-sm">ISO 27001 Certified</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative bg-muted/30 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl mb-4">Get in Touch</h2>
            <p className="text-muted-foreground">
              Ready to secure your email infrastructure? Contact us today.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <Card>
              <CardContent className="p-8">
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm">Full Name</label>
                      <Input placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm">Email Address</label>
                      <Input type="email" placeholder="john@company.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Company</label>
                    <Input placeholder="Company Name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Message</label>
                    <Textarea placeholder="Tell us about your security needs..." rows={4} />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border py-8">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} CyberShield. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
