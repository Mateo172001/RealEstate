'use client';

import { motion } from 'framer-motion';
import { 
  Mail, 
  Globe, 
  Code2,
  Briefcase,
  GraduationCap,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fadeInUp, staggerContainer } from '@/lib/utils/animations';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-12"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center">
            <Badge variant="outline" className="mb-4">
              Technical Test Project
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About This Project
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Full-stack Real Estate application built as a technical assessment
            </p>
          </motion.div>

          {/* Developer Info Card */}
          <motion.div 
            variants={fadeInUp}
            className="bg-card border rounded-2xl p-8 md:p-12 shadow-lg"
          >
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Mateo Avila</h2>
                  <div className="flex items-center gap-2 text-primary mb-4">
                    <GraduationCap className="w-5 h-5" />
                    <span className="text-lg font-semibold">Multimedia Engineer</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Full-stack developer passionate about building scalable, 
                    performant, and user-friendly applications. This project showcases 
                    modern web development practices including clean architecture, 
                    optimized performance, and professional UI/UX design.
                  </p>
                </div>

                {/* Tech Stack */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-primary" />
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Next.js 15</Badge>
                    <Badge variant="secondary">React</Badge>
                    <Badge variant="secondary">TypeScript</Badge>
                    <Badge variant="secondary">TailwindCSS</Badge>
                    <Badge variant="secondary">.NET 8</Badge>
                    <Badge variant="secondary">MongoDB</Badge>
                    <Badge variant="secondary">Docker</Badge>
                    <Badge variant="secondary">React Query</Badge>
                    <Badge variant="secondary">Framer Motion</Badge>
                  </div>
                </div>

                {/* Contact Links */}
                <div className="space-y-3 pt-4">
                  <a
                    href="https://mateoavila.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
                  >
                    <Globe className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-semibold group-hover:text-primary transition-colors">
                        Portfolio Website
                      </p>
                      <p className="text-sm text-muted-foreground">mateoavila.co</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>

                  <a
                    href="mailto:contacto@mateoavila.co"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
                  >
                    <Mail className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-semibold group-hover:text-primary transition-colors">
                        Email
                      </p>
                      <p className="text-sm text-muted-foreground">contacto@mateoavila.co</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Right Column - Project Highlights */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Project Highlights
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-accent/50">
                      <h4 className="font-semibold mb-2">Clean Architecture</h4>
                      <p className="text-sm text-muted-foreground">
                        Implemented layered architecture with separation of concerns, 
                        following SOLID principles and best practices.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-accent/50">
                      <h4 className="font-semibold mb-2">Performance Optimization</h4>
                      <p className="text-sm text-muted-foreground">
                        Image optimization with Next.js, smart caching with React Query, 
                        and lazy loading for optimal Core Web Vitals.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-accent/50">
                      <h4 className="font-semibold mb-2">Modern Tech Stack</h4>
                      <p className="text-sm text-muted-foreground">
                        Built with Next.js 15, TypeScript, .NET 8 Web API, MongoDB, 
                        and containerized with Docker for production deployment.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-accent/50">
                      <h4 className="font-semibold mb-2">Professional UI/UX</h4>
                      <p className="text-sm text-muted-foreground">
                        Responsive design, smooth animations with Framer Motion, 
                        and accessible components following design system principles.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div variants={fadeInUp} className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border bg-card text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Full Stack Development</h3>
              <p className="text-sm text-muted-foreground">
                End-to-end implementation from database to UI components
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-card text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Production Ready</h3>
              <p className="text-sm text-muted-foreground">
                Docker containerization, error handling, and scalable architecture
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-card text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Best Practices</h3>
              <p className="text-sm text-muted-foreground">
                Type safety, clean code, documentation, and maintainable structure
              </p>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            variants={fadeInUp}
            className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Want to Learn More?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Check out my portfolio for more projects and technical details, 
              or feel free to reach out directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://mateoavila.co"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  <Globe className="w-5 h-5" />
                  Visit Portfolio
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
              <a href="mailto:contacto@mateoavila.co">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <Mail className="w-5 h-5" />
                  Send Email
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Footer Note */}
          <motion.div variants={fadeInUp} className="text-center text-sm text-muted-foreground">
            <p>
              This project was developed as a technical assessment to demonstrate 
              proficiency in modern web development technologies and architectural patterns.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

