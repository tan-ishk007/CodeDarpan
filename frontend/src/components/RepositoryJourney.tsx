import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, GitBranch, Network, ScanSearch, Sparkles, Target } from 'lucide-react';

type Chapter = { number: string; overline: string; title: string; detail: string; icon: typeof GitBranch; camera: { scale: number; x: number; y: number; rotate: number } };
const chapters: Chapter[] = [
  { number: '01', overline: 'THE REPOSITORY', title: 'Start with the whole shape.', detail: 'A repository arrives as a landscape of files, modules and first relationships.', icon: GitBranch, camera: { scale: .72, x: 0, y: 0, rotate: 0 } },
  { number: '02', overline: 'SELECT A NODE', title: 'Choose one place to begin.', detail: 'A single file comes forward while its surrounding system falls into context.', icon: Target, camera: { scale: 1.45, x: -92, y: -24, rotate: -2 } },
  { number: '03', overline: 'FOLLOW THE THREAD', title: 'Travel the connection.', detail: 'The route draws itself from the selected node to the relationships it depends on.', icon: Network, camera: { scale: 1.82, x: -155, y: -62, rotate: 2 } },
  { number: '04', overline: 'RETURN TO CONTEXT', title: 'See the system again.', detail: 'The focused path becomes part of the larger architecture instead of disappearing into it.', icon: ScanSearch, camera: { scale: .86, x: 30, y: 8, rotate: 0 } },
  { number: '05', overline: 'READ THE EVIDENCE', title: 'Turn structure into a signal.', detail: 'Complexity, churn, cycles and source evidence attach to the map.', icon: Sparkles, camera: { scale: 1.12, x: -28, y: -18, rotate: -1 } },
];
const routes = ['M365 270 C296 216 224 180 140 130', 'M365 270 C430 210 502 172 590 130', 'M365 270 C420 322 488 378 560 420', 'M365 270 C292 324 228 362 160 390', 'M365 270 C365 205 368 150 370 90', 'M140 130 C275 34 472 24 590 130 C690 218 690 334 560 420 C440 520 236 502 160 390 C52 304 48 200 140 130'];
const storyFigures = [
  '/manus-storage/async-images/VRhyibADRj414gcsfTz213/image-1.webp',
  '/manus-storage/async-images/VRhyibADRj414gcsfTz213/image-2.webp',
  '/manus-storage/async-images/VRhyibADRj414gcsfTz213/image-3.webp',
  '/manus-storage/async-images/VRhyibADRj414gcsfTz213/image-4.webp',
];

export function RepositoryJourney() {
  const [active, setActive] = useState(0);
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);
  const sceneRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ['start end', 'end start'] });
  const sceneY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => { const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]; if (visible) setActive(Number((visible.target as HTMLElement).dataset.chapter)); }, { threshold: .55, rootMargin: '-14% 0px -14% 0px' });
    chapterRefs.current.forEach((element) => element && observer.observe(element));
    return () => observer.disconnect();
  }, []);
  const chapter = chapters[active];
  const Icon = chapter.icon;
  return (
    <section className="journey-story-cinema" aria-labelledby="journey-title">
      <div className="journey-cinema-stage">
        <motion.div ref={sceneRef} style={{ y: sceneY }} className={`journey-visual journey-visual--${active}`} aria-label="Animated atlas graph showing repository architecture at multiple scales" role="img">
          <div className="journey-visual__topline"><span>CODEDARPAN / ATLAS FILM</span><span><i /> FRAME {chapter.number} / 05</span></div>
          <div className="journey-graph" aria-hidden="true">
            <div className="journey-3d-gallery">{storyFigures.map((figure, index) => <motion.div key={figure} className={`journey-3d-card journey-3d-card--${index + 1}`} animate={{ opacity: active === index || active === 4 ? .94 : .34, scale: active === index ? 1.08 : 1, y: active === index ? -8 : 0, rotate: active === index ? 0 : index % 2 ? 2 : -2 }} transition={{ duration: .7, ease: [0.16, 1, .3, 1] }}><img src={figure} alt="" /><span>{['EXPLORE', 'DIAGNOSE', 'ONBOARD', 'IMPACT'][index]}</span></motion.div>)}</div>
            <motion.div className="journey-camera" animate={chapter.camera} transition={{ type: 'spring', stiffness: 68, damping: 19 }}>
              <svg viewBox="0 0 730 540" preserveAspectRatio="xMidYMid meet">
                <defs><linearGradient id="journey-line" x1="0" x2="1"><stop offset="0" stopColor="#af8c57" /><stop offset="1" stopColor="#8f3030" /></linearGradient><filter id="engraved-shadow"><feDropShadow dx="0" dy="8" stdDeviation="5" floodColor="#6d5334" floodOpacity=".18" /></filter></defs>
                <g className="journey-artefacts"><g className="journey-artefact journey-artefact--north"><path className="artefact-extrude" d="M290 58 L382 33 L432 63 L340 89 Z" /><path className="artefact-face" d="M290 48 L382 23 L432 53 L340 79 Z" /><circle cx="360" cy="50" r="13" /><path d="M329 56 L392 39" /></g><g className="journey-artefact journey-artefact--west"><path className="artefact-extrude" d="M62 226 L152 201 L185 222 L95 248 Z" /><path className="artefact-face" d="M62 216 L152 191 L185 212 L95 238 Z" /><circle cx="125" cy="214" r="10" /><circle cx="155" cy="207" r="5" /></g><g className="journey-artefact journey-artefact--east"><path className="artefact-extrude" d="M548 238 L627 214 L667 240 L588 264 Z" /><path className="artefact-face" d="M548 228 L627 204 L667 230 L588 254 Z" /><path d="M575 230 L635 212 M585 239 L646 221" /></g><g className="journey-artefact journey-artefact--south"><path className="artefact-extrude" d="M330 437 L420 411 L461 437 L370 463 Z" /><path className="artefact-face" d="M330 427 L420 401 L461 427 L370 453 Z" /><circle cx="393" cy="428" r="12" /></g></g>
                <g className="journey-field-lines"><ellipse cx="365" cy="270" rx="305" ry="205" /><ellipse cx="365" cy="270" rx="232" ry="151" /><ellipse cx="365" cy="270" rx="116" ry="77" /><path d="M64 270H666M365 44V496" /></g>
                <g className="journey-links">{routes.map((route, index) => <motion.path key={route} d={route} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: active >= Math.min(index + 1, 5) ? 1 : .22, opacity: active >= Math.min(index + 1, 5) ? 1 : .22 }} transition={{ duration: 1.1, delay: index * .08, ease: 'easeOut' }} />)}</g>
                <g className="journey-packets"><circle cx="365" cy="270" r="4" /><circle cx="140" cy="130" r="3" /><circle cx="590" cy="130" r="3" /><circle cx="560" cy="420" r="3" /><circle cx="160" cy="390" r="3" /><circle cx="370" cy="90" r="3" /></g>
                <motion.g className="journey-node journey-node--a" animate={{ scale: active === 0 ? 1.1 : 1 }} filter="url(#engraved-shadow)"><circle cx="140" cy="130" r="30" /><circle className="node-ring" cx="140" cy="130" r="38" /><text x="140" y="135">UI</text></motion.g><motion.g className="journey-node journey-node--b" animate={{ scale: active === 1 || active === 2 ? 1.12 : 1 }} filter="url(#engraved-shadow)"><circle cx="365" cy="270" r="52" /><circle className="node-ring" cx="365" cy="270" r="64" /><text x="365" y="276">REPO</text></motion.g><motion.g className="journey-node journey-node--c" animate={{ scale: active === 2 ? 1.1 : 1 }} filter="url(#engraved-shadow)"><circle cx="590" cy="130" r="32" /><circle className="node-ring" cx="590" cy="130" r="40" /><text x="590" y="135">API</text></motion.g><motion.g className="journey-node journey-node--d" animate={{ scale: active === 3 ? 1.12 : 1 }} filter="url(#engraved-shadow)"><circle cx="560" cy="420" r="38" /><circle className="node-ring" cx="560" cy="420" r="47" /><text x="560" y="425">TEST</text></motion.g><motion.g className="journey-node journey-node--e" animate={{ scale: active >= 4 ? 1.1 : 1 }} filter="url(#engraved-shadow)"><circle cx="160" cy="390" r="35" /><circle className="node-ring" cx="160" cy="390" r="44" /><text x="160" y="395">DOCS</text></motion.g><motion.g className="journey-node journey-node--f" animate={{ scale: active >= 4 ? 1.08 : 1 }} filter="url(#engraved-shadow)"><circle cx="370" cy="90" r="29" /><circle className="node-ring" cx="370" cy="90" r="37" /><text x="370" y="95">AUTH</text></motion.g>
              </svg>
            </motion.div>
            <motion.div className="journey-callout journey-callout--top" key={`top-${active}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}><span>NOW READING</span><strong>{chapter.overline.toLowerCase()}</strong></motion.div>
            <motion.div className="journey-callout journey-callout--bottom" key={`bottom-${active}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}><Icon size={14} /><span>{active < 2 ? 'repository indexed' : active < 4 ? 'path in focus' : 'evidence attached'}</span></motion.div>
          </div>
          <div className="journey-visual__footer"><span>FILES / SYMBOLS / RELATIONSHIPS</span><ArrowDown size={15} className="journey-arrow" /></div>
        </motion.div>
      </div>
      <div className="journey-cinema-intro"><p className="eyebrow"><span className="eyebrow-rule" />A STORY THROUGH THE ATLAS</p><h2 id="journey-title">Travel the graph.<br />Keep the <em>context.</em></h2><p>One repository. Five changes of scale. Follow the architecture from the first shape to the evidence attached to it.</p></div>
      <div className="journey-cinema-chapters">
        {chapters.map((item, index) => <article key={item.number} ref={(element) => { chapterRefs.current[index] = element; }} data-chapter={index} className={`journey-cinema-chapter${active === index ? ' is-active' : ''}`}><div className="journey-cinema-chapter__content"><span className="journey-cinema-number">{item.number}</span><span className="journey-cinema-overline">{item.overline}</span><h3>{item.title}</h3><p>{item.detail}</p></div></article>)}
      </div>
    </section>
  );
}
