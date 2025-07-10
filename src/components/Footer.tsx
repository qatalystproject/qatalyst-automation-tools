
import { useState } from "react";
import { Github, Linkedin, BookOpen, Globe } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const [language, setLanguage] = useState("en");

  const content = {
    en: {
      aboutUs: "About Us",
      aboutDescription: "QAtalyst is an advanced test automation platform that helps QA teams generate, manage, and execute tests more efficiently. Our mission is to make testing smarter and shipping faster.",
      aboutContent: "We believe in empowering quality assurance professionals with cutting-edge tools that streamline the testing process. From Gherkin scenario generation to Playwright code automation, QAtalyst bridges the gap between manual testing and automated excellence.",
      copyright: "© 2024 QAtalyst. All rights reserved.",
      socialMedia: "Follow Us"
    },
    id: {
      aboutUs: "Tentang Kami",
      aboutDescription: "QAtalyst adalah platform otomasi testing canggih yang membantu tim QA menghasilkan, mengelola, dan mengeksekusi tes dengan lebih efisien. Misi kami adalah membuat testing lebih cerdas dan pengiriman lebih cepat.",
      aboutContent: "Kami percaya dalam memberdayakan profesional quality assurance dengan tools terdepan yang menyederhanakan proses testing. Dari pembuatan skenario Gherkin hingga otomasi kode Playwright, QAtalyst menjembatani kesenjangan antara manual testing dan keunggulan otomatis.",
      copyright: "© 2024 QAtalyst. Seluruh hak cipta dilindungi.",
      socialMedia: "Ikuti Kami"
    }
  };

  const currentContent = content[language as keyof typeof content];

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
                  className="hover:text-bright-cyan transition-colors"
                  style={{ color: '#F1F5F9' }}
                >
                  {currentContent.aboutUs}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] border-slate-700" style={{ backgroundColor: '#0A192F' }}>
                <DialogHeader>
                  <DialogTitle className="text-xl" style={{ color: '#F1F5F9' }}>
                    {currentContent.aboutUs}
                  </DialogTitle>
                  <DialogDescription style={{ color: '#64748B' }}>
                    {currentContent.aboutDescription}
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <p className="leading-relaxed" style={{ color: '#F1F5F9' }}>
                    {currentContent.aboutContent}
                  </p>
                </div>
              </DialogContent>
            </Dialog>

            {/* Language Switcher */}
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" style={{ color: '#5BC0FF' }} />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-dark-slate border border-slate-600 text-sm rounded px-2 py-1 focus:outline-none focus:border-bright-cyan"
                style={{ backgroundColor: '#0C1B29', color: '#F1F5F9' }}
              >
                <option value="en">English</option>
                <option value="id">Bahasa Indonesia</option>
              </select>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex items-center space-x-6">
            <span className="text-sm" style={{ color: '#64748B' }}>{currentContent.socialMedia}:</span>
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
          <p className="text-sm" style={{ color: '#64748B' }}>
            {currentContent.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
