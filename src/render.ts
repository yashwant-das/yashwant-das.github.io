import { PortfolioData } from './types.js';
import { handleError } from './utils.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

const SOCIAL_ICON_PATHS: Record<string, string> = {
  github:
    '<path d="M12 .297C5.37.297 0 5.67 0 12.297c0 5.292 3.438 9.787 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.016-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.082-.729.082-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.468-2.382 1.235-3.221-.124-.303-.536-1.523.117-3.176 0 0 1.008-.323 3.3 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.29-1.553 3.297-1.23 3.297-1.23.655 1.653.243 2.873.12 3.176.77.839 1.233 1.911 1.233 3.221 0 4.61-2.804 5.624-5.476 5.921.43.371.823 1.104.823 2.226 0 1.606-.014 2.898-.014 3.293 0 .32.216.694.825.576C20.565 22.08 24 17.584 24 12.297 24 5.67 18.627.297 12 .297Z"/>',
  linkedin:
    '<path d="M22.225 0H1.771A1.77 1.77 0 0 0 0 1.771v20.452A1.77 1.77 0 0 0 1.771 24h20.452A1.77 1.77 0 0 0 24 22.223V1.771A1.77 1.77 0 0 0 22.225 0ZM7.12 20.452H3.555V9h3.565v11.452ZM5.339 7.433a2.063 2.063 0 1 1 0-4.125 2.063 2.063 0 0 1 0 4.125Zm15.108 13.019h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.372-1.852 3.604 0 4.27 2.372 4.27 5.459v6.284Z"/>',
  medium:
    '<path d="M2.01 6.3c.02-.2-.057-.4-.205-.53L0 4.08V3.78h6.261l4.775 10.483L14.9 3.78H21l-.002.3-1.6 1.53a.322.322 0 0 0-.12.31v10.72a.322.322 0 0 0 .12.31l1.56 1.53V18h-7.62v-.29l1.62-1.58c.16-.16.16-.21.16-.44V8.96l-4.5 9.06h-.61L5.04 8.96v6.03c-.04.32.06.64.29.87l2.11 2.56v.29H0v-.29l2.11-2.56c.225-.23.33-.55.27-.87V6.3Z"/>',
  x: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
  twitter:
    '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
  // Gmail / email
  email:
    '<path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.279 24 3.434 24 5.457Z"/>',
};

const ICON_CONFIG = {
  SVG_VIEWBOX: '0 0 24 24',
};

export function showLoadingSkeletons() {
  const skeletons = document.querySelectorAll('.loading-container');
  skeletons.forEach((skeleton) => {
    skeleton.classList.remove('hidden');
  });
}

export function hideLoadingSkeletons() {
  const skeletons = document.querySelectorAll('.loading-container');
  skeletons.forEach((skeleton) => {
    skeleton.classList.add('hidden');
  });
}

export function applyContent(data: PortfolioData) {
  hideLoadingSkeletons();

  if (!data || typeof data !== 'object') {
    handleError('Invalid data provided to applyContent', 'applyContent');
    return;
  }

  if (data.name) {
    const titleEl = document.getElementById('page-title');
    if (titleEl) {
      const subtitle = data.subtitle ? ` — ${data.subtitle}` : '';
      titleEl.textContent = `${data.name}${subtitle} Portfolio`;
    }
    const descEl = document.getElementById('page-description');
    if (descEl) {
      descEl.setAttribute(
        'content',
        `Portfolio of ${data.name} — projects, experience, skills, and contact.`
      );
    }
  }

  if (data.name) {
    const structuredDataEl = document.getElementById('structured-data');
    if (structuredDataEl) {
      const socialUrls = data.contact?.socials
        ? Object.values(data.contact.socials).filter((url) => url && !url.startsWith('mailto:'))
        : [];
      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: data.name || '',
        url: socialUrls[0] || '',
        jobTitle: data.subtitle || '',
        sameAs: socialUrls,
      };
      structuredDataEl.textContent = JSON.stringify(structuredData);
    }
  }

  if (data.name) {
    const logoMark = document.getElementById('logo-mark');
    const logoText = document.getElementById('logo-text');
    if (logoMark) {
      const nameParts = data.name.trim().split(/\s+/);
      const firstInitial = nameParts[0]?.[0] ?? '';
      const lastInitial = nameParts.length >= 2 ? (nameParts.at(-1)?.[0] ?? '') : '';
      const initials = `${firstInitial}${lastInitial}`.toUpperCase();
      logoMark.textContent = initials;
    }
    if (logoText) {
      logoText.textContent = data.name;
    }

    const footerName = document.getElementById('footer-name');
    if (footerName) footerName.textContent = data.name;
  }

  if (data.resume && typeof data.resume === 'string' && data.resume.trim()) {
    const resumeLink = document.getElementById('resume-link') as HTMLAnchorElement;
    if (resumeLink) {
      resumeLink.href = data.resume;
      resumeLink.removeAttribute('style');
    }
  }

  const avatarImg = document.getElementById('avatar-img') as HTMLImageElement;
  if (avatarImg) {
    avatarImg.style.display = '';
    if (data.name) {
      avatarImg.alt = `Portrait of ${data.name}`;
    } else {
      avatarImg.alt = 'Profile photo';
    }
    if (data.avatar) {
      avatarImg.src = data.avatar;
      if ('fetchPriority' in avatarImg) {
        (avatarImg as HTMLImageElement & { fetchPriority: string }).fetchPriority = 'high';
      }
    }
  }

  const aboutBody = document.getElementById('about-body');
  if (aboutBody && 'about' in data) {
    // Blank lines in the source become real paragraphs. Built as text nodes
    // rather than innerHTML so content stays data, never markup.
    const paragraphs = (data.about || '')
      .split(/\n\s*\n/)
      .map((para) => para.trim())
      .filter(Boolean);
    aboutBody.textContent = '';
    if (paragraphs.length > 1) {
      paragraphs.forEach((para) => {
        const p = document.createElement('p');
        p.textContent = para;
        aboutBody.appendChild(p);
      });
    } else {
      aboutBody.textContent = paragraphs[0] ?? '';
    }
  }

  const experienceList = document.getElementById('experience-list');
  if (experienceList && 'experience' in data) {
    const activeExperience = Array.isArray(data.experience)
      ? data.experience.filter((exp) => !exp.disabled)
      : [];
    if (activeExperience.length > 0) {
      experienceList.innerHTML = '';
      activeExperience.forEach((exp) => {
        const li = document.createElement('li');
        // A career break is a timeline marker, not a job: styled quieter than a real role.
        const isBreak = exp.kind === 'break';
        li.className = isBreak ? 'timeline-item timeline-item-break' : 'timeline-item';
        const meta = document.createElement('div');
        meta.className = 'timeline-meta';

        if (isBreak) {
          const marker = document.createElement('div');
          marker.className = 'company-logo company-logo-break';
          marker.setAttribute('aria-hidden', 'true');
          meta.appendChild(marker);
        } else if (exp.logo) {
          const img = document.createElement('img');
          img.className = 'company-logo';
          img.src = exp.logo;
          img.alt = `${exp.company} logo`;
          img.loading = 'lazy';
          meta.appendChild(img);
        } else {
          const placeholder = document.createElement('div');
          placeholder.className = 'company-logo company-logo-placeholder';
          placeholder.setAttribute('aria-hidden', 'true');
          const words = exp.company.split(/\s+/).filter(Boolean);
          const firstLetter = words[0]?.[0] ?? '';
          const secondLetter = words.length >= 2 ? (words[1]?.[0] ?? '') : (words[0]?.[1] ?? '');
          const initials = `${firstLetter}${secondLetter}` || 'QA';
          placeholder.textContent = initials.toUpperCase();
          meta.appendChild(placeholder);
        }

        const metaContent = document.createElement('div');
        metaContent.className = 'timeline-meta-content';
        const role = document.createElement('span');
        role.className = 'role';
        role.textContent = exp.role || '';
        const company = document.createElement('span');
        company.className = 'company';
        company.textContent = exp.company || '';
        const period = document.createElement('span');
        period.className = 'period';
        period.textContent = exp.period || '';
        metaContent.append(role, company, period);
        meta.appendChild(metaContent);
        li.appendChild(meta);

        if (exp.highlights && exp.highlights.length > 0) {
          const ul = document.createElement('ul');
          ul.className = 'highlights';
          exp.highlights.forEach((h) => {
            const liH = document.createElement('li');
            liH.textContent = h;
            ul.appendChild(liH);
          });
          li.appendChild(ul);
        }
        experienceList.appendChild(li);
      });
    } else {
      experienceList.innerHTML = '';
    }
  }

  const projectsGrid = document.getElementById('projects-grid');
  if (projectsGrid && 'projects' in data) {
    const activeProjects = Array.isArray(data.projects)
      ? data.projects.filter((p) => !p.disabled)
      : [];

    activeProjects.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

    if (activeProjects.length > 0) {
      projectsGrid.innerHTML = '';
      activeProjects.forEach((p) => {
        const card = document.createElement('article');
        card.className = 'project-card';
        const h3 = document.createElement('h3');
        h3.textContent = p.title || '';

        if (p.featured) {
          const badge = document.createElement('span');
          badge.textContent = '★ Featured';
          badge.style.display = 'inline-block';
          badge.style.marginLeft = 'var(--spacing-sm)';
          badge.style.fontSize = '0.75rem';
          badge.style.fontWeight = '600';
          badge.style.color = 'var(--primary-color)';
          badge.style.background = 'var(--surface-color)';
          badge.style.padding = '0.125rem 0.375rem';
          badge.style.borderRadius = 'var(--radius-pill)';
          badge.style.border = '1px solid var(--border-color)';
          badge.style.verticalAlign = 'middle';
          h3.appendChild(badge);
        }

        const desc = document.createElement('p');
        desc.textContent = p.description || '';
        const tags = document.createElement('ul');
        tags.className = 'tags';

        const sortedTags = Array.isArray(p.tags)
          ? [...p.tags].sort((a, b) =>
              String(a).localeCompare(String(b), undefined, { sensitivity: 'base' })
            )
          : [];
        sortedTags.forEach((t) => {
          const li = document.createElement('li');
          li.textContent = t;
          tags.appendChild(li);
        });

        const linkNodes: HTMLAnchorElement[] = [];
        if (p.live) {
          const a = document.createElement('a');
          a.href = p.live;
          a.setAttribute('aria-label', 'Live demo');
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
          const icon = document.createElementNS(SVG_NS, 'svg');
          icon.setAttribute('viewBox', '0 0 24 24');
          icon.setAttribute('fill', 'none');
          icon.setAttribute('stroke', 'currentColor');
          icon.setAttribute('stroke-width', '2');
          icon.setAttribute('stroke-linecap', 'round');
          icon.setAttribute('stroke-linejoin', 'round');
          icon.setAttribute('width', '16');
          icon.setAttribute('height', '16');
          icon.setAttribute('aria-hidden', 'true');
          icon.innerHTML =
            '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>';
          const text = document.createElement('span');
          text.className = 'link-text';
          text.textContent = 'Live Demo';
          a.appendChild(icon);
          a.appendChild(text);
          linkNodes.push(a);
        }
        if (p.code) {
          const a = document.createElement('a');
          a.href = p.code;
          a.setAttribute('aria-label', 'Source code');
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
          const icon = document.createElementNS(SVG_NS, 'svg');
          icon.setAttribute('viewBox', '0 0 24 24');
          icon.setAttribute('fill', 'none');
          icon.setAttribute('stroke', 'currentColor');
          icon.setAttribute('stroke-width', '2');
          icon.setAttribute('stroke-linecap', 'round');
          icon.setAttribute('stroke-linejoin', 'round');
          icon.setAttribute('width', '16');
          icon.setAttribute('height', '16');
          icon.setAttribute('aria-hidden', 'true');
          icon.innerHTML =
            '<polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>';
          const text = document.createElement('span');
          text.className = 'link-text';
          text.textContent = 'Source Code';
          a.appendChild(icon);
          a.appendChild(text);
          linkNodes.push(a);
        }
        card.append(h3, desc, tags);
        if (linkNodes.length) {
          const links = document.createElement('div');
          links.className = 'links';
          linkNodes.forEach((node) => links.appendChild(node));
          card.appendChild(links);
        }
        projectsGrid.appendChild(card);
      });
    } else {
      projectsGrid.innerHTML = '';
    }
  }

  const skillsContainer = document.getElementById('skills-container');
  if (skillsContainer && 'skills' in data) {
    skillsContainer.innerHTML = '';
    if (data.skills) {
      if (Array.isArray(data.skills)) {
        const activeSkills = data.skills.filter((s) => typeof s === 'string' || !s.disabled);
        if (activeSkills.length > 0) {
          const category = document.createElement('div');
          category.className = 'skill-category';
          const h3 = document.createElement('h3');
          h3.textContent = 'Technical Skills';
          const ul = document.createElement('ul');
          ul.className = 'skills';
          activeSkills.forEach((s) => {
            const li = document.createElement('li');
            li.textContent = typeof s === 'string' ? s : s.name;
            ul.appendChild(li);
          });
          category.append(h3, ul);
          skillsContainer.appendChild(category);
        }
      } else if (typeof data.skills === 'object') {
        Object.entries(data.skills).forEach(([categoryName, skills]) => {
          if (!Array.isArray(skills)) return;
          const activeSkills = skills.filter(
            (skill) => typeof skill === 'string' || !skill.disabled
          );
          if (activeSkills.length === 0) return;
          const category = document.createElement('div');
          category.className = 'skill-category';
          const h3 = document.createElement('h3');
          h3.textContent = categoryName;
          const ul = document.createElement('ul');
          ul.className = 'skills';
          activeSkills.forEach((skill) => {
            const li = document.createElement('li');
            li.textContent = typeof skill === 'string' ? skill : skill.name;
            ul.appendChild(li);
          });
          category.append(h3, ul);
          skillsContainer.appendChild(category);
        });
      }
    }
  }

  const educationList = document.getElementById('education-list');
  if (educationList && 'education' in data) {
    const activeEducation = Array.isArray(data.education)
      ? data.education.filter((ed) => !ed.disabled)
      : [];
    if (activeEducation.length > 0) {
      educationList.innerHTML = '';
      activeEducation.forEach((ed) => {
        const li = document.createElement('li');
        const degree = document.createElement('span');
        degree.className = 'degree';
        degree.textContent = ed.degree || '';
        const school = document.createElement('span');
        school.className = 'school';
        school.textContent = ed.school || '';
        const period = document.createElement('span');
        period.className = 'period';
        period.textContent = ed.period || '';
        li.append(degree, school, period);
        educationList.appendChild(li);
      });
    } else {
      educationList.innerHTML = '';
    }
  }

  // Certifications
  const certificationsList = document.getElementById('certifications-list');
  if (certificationsList && 'certifications' in data) {
    const activeCertifications = Array.isArray(data.certifications)
      ? data.certifications.filter((cert) => !cert.disabled)
      : [];
    if (activeCertifications.length > 0) {
      certificationsList.innerHTML = '';
      activeCertifications.forEach((cert) => {
        const li = document.createElement('li');
        li.className = 'timeline-item';
        const meta = document.createElement('div');
        meta.className = 'timeline-meta';

        if (cert.logo) {
          const img = document.createElement('img');
          img.className = 'company-logo';
          img.src = cert.logo;
          img.alt = `${cert.organization} logo`;
          img.loading = 'lazy';
          meta.appendChild(img);
        }

        const metaContent = document.createElement('div');
        metaContent.className = 'timeline-meta-content';
        const name = document.createElement('span');
        name.className = 'role';
        name.textContent = cert.name || '';
        const org = document.createElement('span');
        org.className = 'company';
        org.textContent = cert.organization || '';
        metaContent.append(name, org);

        if (cert.credentialUrl) {
          const link = document.createElement('a');
          link.href = cert.credentialUrl;
          link.className = 'credential-link';
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');

          const text = document.createElement('span');
          text.textContent = 'View Credential';

          const icon = document.createElementNS(SVG_NS, 'svg');
          icon.setAttribute('viewBox', '0 0 24 24');
          icon.setAttribute('fill', 'none');
          icon.setAttribute('stroke', 'currentColor');
          icon.setAttribute('stroke-width', '2.5');
          icon.setAttribute('stroke-linecap', 'round');
          icon.setAttribute('stroke-linejoin', 'round');
          icon.setAttribute('aria-hidden', 'true');
          icon.innerHTML =
            '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>';

          link.append(text, icon);
          metaContent.appendChild(link);
        }

        meta.appendChild(metaContent);
        li.appendChild(meta);
        certificationsList.appendChild(li);
      });
    } else {
      certificationsList.innerHTML = '';
    }
  }

  if (data.name) {
    const el = document.getElementById('hero-name');
    if (el) {
      el.textContent = data.name;
      el.removeAttribute('style');
    }
  }
  if (data.subtitle) {
    const el = document.getElementById('hero-subtitle');
    if (el) {
      el.textContent = data.subtitle;
      el.removeAttribute('style');
    }
  }
  if (data.heroSummary) {
    const el = document.querySelector('.hero-summary');
    if (el) {
      el.textContent = data.heroSummary;
      el.removeAttribute('style');
    }
  }
  const heroMeta = document.getElementById('hero-meta');
  if (heroMeta) {
    heroMeta.innerHTML = '';
    const activeStats = Array.isArray(data.heroStats)
      ? data.heroStats.filter((s) => !s.disabled)
      : [];
    if (activeStats.length > 0) {
      activeStats.forEach((stat) => {
        if (!stat.value || !stat.label) return;
        const item = document.createElement('span');
        const value = document.createElement('strong');
        value.textContent = stat.value;
        item.append(value, ` ${stat.label}`);
        heroMeta.appendChild(item);
      });
    }
    if (heroMeta.childElementCount > 0) {
      heroMeta.removeAttribute('style');
    }
  }

  const hasHeroContent = !!(data.name || data.subtitle || data.heroSummary);
  const hasResume = !!(data.resume && typeof data.resume === 'string' && data.resume.trim());
  if (hasHeroContent || hasResume) {
    const heroCta = document.querySelector('.hero-cta');
    if (heroCta) {
      heroCta.removeAttribute('style');
    }
  }

  const contactSkeleton = document.getElementById('contact-skeleton');
  const contactCard = document.querySelector('.contact-card');
  if (contactSkeleton) {
    contactSkeleton.classList.add('hidden');
  }
  if (contactCard) {
    contactCard.removeAttribute('style');
  }

  const ul = document.getElementById('social-list');
  const socialSection = ul ? (ul.closest('.social-section') as HTMLElement) : null;
  const socialIntro = socialSection
    ? (socialSection.querySelector('.social-intro') as HTMLElement)
    : null;

  if (data.contact?.socials && typeof data.contact.socials === 'object') {
    if (ul) {
      ul.innerHTML = '';
      for (const [label, href] of Object.entries(data.contact.socials)) {
        if (!href) continue;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = href as string;
        a.setAttribute('aria-label', label);
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');

        const iconNode = createSocialIcon(label);
        if (iconNode) a.appendChild(iconNode);

        const textNode = document.createElement('span');
        textNode.className = 'social-label';
        textNode.textContent = label;
        a.appendChild(textNode);
        li.appendChild(a);
        ul.appendChild(li);
      }

      if (ul.childElementCount > 0) {
        if (socialSection) socialSection.style.display = '';
        if (socialIntro) socialIntro.style.display = '';
      } else {
        if (socialSection) socialSection.style.display = 'none';
        if (socialIntro) socialIntro.style.display = 'none';
      }

      const emailHref = data.contact?.socials?.Email;
      const emailAddress =
        typeof emailHref === 'string' && emailHref.startsWith('mailto:')
          ? emailHref.replace('mailto:', '').split('?')[0]
          : '';

      const existingCopyActions = socialSection?.querySelector('.contact-actions');
      if (existingCopyActions) existingCopyActions.remove();

      if (emailAddress && socialSection) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'contact-actions';

        const copyBtn = document.createElement('button');
        copyBtn.id = 'copy-email-btn';
        copyBtn.type = 'button';
        copyBtn.className = 'btn-copy-email';
        copyBtn.setAttribute('aria-label', `Copy email address ${emailAddress} to clipboard`);

        const iconSvg = document.createElementNS(SVG_NS, 'svg');
        iconSvg.setAttribute('viewBox', ICON_CONFIG.SVG_VIEWBOX);
        iconSvg.setAttribute('width', '16');
        iconSvg.setAttribute('height', '16');
        iconSvg.setAttribute('fill', 'none');
        iconSvg.setAttribute('stroke', 'currentColor');
        iconSvg.setAttribute('stroke-width', '2');
        iconSvg.setAttribute('stroke-linecap', 'round');
        iconSvg.setAttribute('stroke-linejoin', 'round');
        iconSvg.setAttribute('aria-hidden', 'true');
        iconSvg.innerHTML =
          '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>';

        const btnText = document.createElement('span');
        btnText.className = 'copy-btn-text';
        btnText.textContent = `Copy ${emailAddress}`;

        copyBtn.append(iconSvg, btnText);

        copyBtn.addEventListener('click', async () => {
          try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              await navigator.clipboard.writeText(emailAddress);
            } else {
              const input = document.createElement('input');
              input.value = emailAddress;
              document.body.appendChild(input);
              input.select();
              document.execCommand('copy');
              document.body.removeChild(input);
            }
            btnText.textContent = 'Email Copied!';
            copyBtn.classList.add('copied');
            iconSvg.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
            setTimeout(() => {
              btnText.textContent = `Copy ${emailAddress}`;
              copyBtn.classList.remove('copied');
              iconSvg.innerHTML =
                '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>';
            }, 2000);
          } catch {
            btnText.textContent = 'Email Copied!';
            copyBtn.classList.add('copied');
            setTimeout(() => {
              btnText.textContent = `Copy ${emailAddress}`;
              copyBtn.classList.remove('copied');
            }, 2000);
          }
        });

        actionsDiv.appendChild(copyBtn);
        socialSection.appendChild(actionsDiv);
      }
    }
  } else {
    if (socialSection) socialSection.style.display = 'none';
    if (socialIntro) socialIntro.style.display = 'none';
    if (ul) ul.style.display = 'none';
  }

  hideEmptySections(data);
}

function hideEmptySections(data: PortfolioData) {
  if (!data || typeof data !== 'object') return;

  const sectionChecks: Record<string, () => boolean> = {
    home: () => {
      return !!(data.name || data.subtitle || data.heroSummary || data.resume);
    },
    about: () => {
      const aboutBody = document.getElementById('about-body');
      return !!(aboutBody && aboutBody.textContent && aboutBody.textContent.trim().length > 0);
    },
    experience: () => {
      const experienceList = document.getElementById('experience-list');
      return !!(experienceList && experienceList.children.length > 0);
    },
    projects: () => {
      const projectsGrid = document.getElementById('projects-grid');
      return !!(projectsGrid && projectsGrid.children.length > 0);
    },
    skills: () => {
      const skillsContainer = document.getElementById('skills-container');
      return !!(skillsContainer && skillsContainer.children.length > 0);
    },
    education: () => {
      const educationList = document.getElementById('education-list');
      return !!(educationList && educationList.children.length > 0);
    },
    certifications: () => {
      const certificationsList = document.getElementById('certifications-list');
      return !!(certificationsList && certificationsList.children.length > 0);
    },
    contact: () => {
      return !!(data.contact?.socials && Object.keys(data.contact.socials).length > 0);
    },
  };

  Object.entries(sectionChecks).forEach(([sectionId, hasContent]) => {
    const section = document.getElementById(sectionId);
    const navLink = document.querySelector(`#site-nav a[href="#${sectionId}"]`);

    // Explicit visibility overrides auto-hiding
    const explicitVisibility = data.visibility
      ? data.visibility[sectionId as keyof typeof data.visibility]
      : undefined;
    const shouldShow = explicitVisibility === false ? false : hasContent();

    if (!shouldShow) {
      if (section) section.style.display = 'none';
      if (navLink && navLink.parentElement) {
        navLink.parentElement.style.display = 'none';
      }
    } else {
      if (section) section.style.display = '';
      if (navLink && navLink.parentElement) {
        navLink.parentElement.style.display = '';
      }
    }
  });
}

function createSocialIcon(label: string): HTMLElement | null {
  if (!label || typeof label !== 'string') return null;

  const normalized = label.trim().toLowerCase();
  const iconKey = Object.keys(SOCIAL_ICON_PATHS).find((name) => normalized.includes(name));
  if (!iconKey) return null;

  const span = document.createElement('span');
  span.className = 'social-icon';
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', ICON_CONFIG.SVG_VIEWBOX);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const iconPath = SOCIAL_ICON_PATHS[iconKey];
  if (!iconPath) return null;
  svg.innerHTML = iconPath;
  span.appendChild(svg);
  return span;
}
