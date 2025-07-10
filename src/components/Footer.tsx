
import { Github, Linkedin, BookOpen, Globe } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <footer className="border-t border-slate-700 mt-16" style={{ backgroundColor: '#0A192F' }}>
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* About Us Section */}
          <div className="flex items-center space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="hover:text-bright-cyan transition-colors text-primary"
                >
                  {t('aboutUs')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] border-slate-700" style={{ backgroundColor: '#0A192F' }}>
                <DialogHeader>
                  <DialogTitle className="text-xl text-primary">
                    {t('aboutUs')}
                  </DialogTitle>
                  <DialogDescription className="text-muted">
                    {t('aboutDescription')}
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <p className="leading-relaxed text-primary">
                    {t('aboutContent')}
                  </p>
                </div>
              </DialogContent>
            </Dialog>

            {/* Language Switcher */}
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" style={{ color: '#5BC0FF' }} />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'id')}
                className="bg-dark-slate border border-slate-600 text-sm rounded px-2 py-1 focus:outline-none focus:border-bright-cyan text-primary"
                style={{ backgroundColor: '#0C1B29' }}
              >
                <option value="en">English</option>
                <option value="id">Bahasa Indonesia</option>
              </select>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex items-center space-x-6">
            <span className="text-sm text-muted">{t('socialMedia')}:</span>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/in/ananta-widy"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-bright-cyan"
                style={{ color: '#5BC0FF' }}
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/anantawidy/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-bright-cyan"
                style={{ color: '#5BC0FF' }}
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://medium.com/@anantawidy"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-bright-cyan"
                style={{ color: '#5BC0FF' }}
                aria-label="Medium"
              >
                <BookOpen className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-slate-700 text-center">
          <p className="text-sm text-muted">
            {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
