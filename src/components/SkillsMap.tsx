import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Gamepad2, MousePointerClick, Skull, Trophy } from 'lucide-react';

const skillsList = [
    // Level 1: Frontend & Design (Easy)
    { name: "React", category: "frontend", level: 1 },
    { name: "Angular", category: "frontend", level: 1 },
    { name: "Tailwind", category: "frontend", level: 1 },
    { name: "UI/UX", category: "design", level: 1 },
    { name: "Figma", category: "design", level: 1 },
    // Level 2: Backend & Data (Medium)
    { name: "Node.js", category: "backend", level: 2 },
    { name: "Go", category: "backend", level: 2 },
    { name: "Python", category: "backend", level: 2 },
    { name: "PostgreSQL", category: "backend", level: 2 },
    { name: "AWS", category: "infra", level: 2 },
    // Level 3: AI, Core & Advanced Infra (Hard)
    { name: "Kubernetes", category: "infra", level: 3 },
    { name: "Terraform", category: "infra", level: 3 },
    { name: "Microservices", category: "core", level: 3 },
    { name: "MCP Servers", category: "ai", level: 3 },
    { name: "AI Agents", category: "ai", level: 3 }
];

const categoryColors: Record<string, string> = {
    frontend: '#ff00ff', // Magenta
    backend: '#00ffff', // Cyan
    infra: '#3b82f6',   // Blue
    ai: '#a2e872',      // Accent Green
    core: '#f97316',    // Orange
    design: '#a855f7',  // Purple
    boss: '#FF0055'     // Red Boss
};

type Invader = {
    id: number, name: string, category: string,
    x: number, y: number, startY: number, timeOffset: number,
    width: number, height: number, hp: number, maxHp: number,
    isAlive: boolean, isBoss?: boolean,
    attackCooldown?: number
};

export default function SkillsMap() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [gameState, setGameState] = useState<'start' | 'playing' | 'won' | 'gameover'>('start');
    const [currentLevel, setCurrentLevel] = useState(1);
    const [unlockedSkills, setUnlockedSkills] = useState<string[]>([]);
    const [finalScore, setFinalScore] = useState(0);
    
    const requestRef = useRef<number>();
    const stateRef = useRef({
        player: { x: 0, y: 0, width: 40, height: 30, speed: 7, stunnedUntil: 0, hp: 3, maxHp: 3 },
        projectiles: [] as { x: number, y: number, width: number, height: number, speed: number }[],
        enemyProjectiles: [] as { x: number, y: number, width: number, height: number, vx: number, vy: number, color: string }[],
        invaders: [] as Invader[],
        particles: [] as { x: number, y: number, vx: number, vy: number, life: number, maxLife: number, color: string }[],
        stars: [] as { x: number, y: number, speed: number, size: number, brightness: number }[],
        invaderDirection: 1,
        invaderSpeed: 2,
        lastShotTime: 0,
        gameStartTime: 0,
        level: 1,
        score: 0,
        difficulty: 1.0,
        keys: {} as Record<string, boolean>
    });

    const spawnLevel = (level: number, width: number, height: number) => {
        stateRef.current.projectiles = [];
        stateRef.current.enemyProjectiles = [];
        const diff = stateRef.current.difficulty;
        
        if (level === 4) {
            // Boss Level — scale boss to canvas
            const bossW = Math.min(120, width * 0.3);
            const bossH = Math.min(80, height * 0.15);
            stateRef.current.invaderSpeed = Math.min(5 * diff, width * 0.012 * diff);
            stateRef.current.invaders = [{
                id: 999, name: "SYSTEM ARCHITECT", category: "boss",
                x: width / 2 - bossW / 2, y: 80, startY: 80, timeOffset: 0, 
                width: bossW, height: bossH, hp: 30 * diff, maxHp: 30 * diff, isAlive: true, isBoss: true,
                attackCooldown: 60 / diff
            }];
        } else {
            // Normal Wave — adapt grid to screen width
            stateRef.current.invaderSpeed = (1.5 + (level * 0.8)) * diff;
            const levelSkills = skillsList.filter(s => s.level === level);
            
            // Dynamic columns: 5 on desktop, 3 on narrow screens
            const cols = width < 400 ? 3 : 5;
            const invaderWidth = width < 400 ? Math.floor((width - 40) / cols) - 10 : 100;
            const invaderHeight = 30;
            const paddingX = width < 400 ? 8 : 20;
            const paddingY = 30;
            const totalGridWidth = cols * invaderWidth + (cols - 1) * paddingX;
            const startX = (width - totalGridWidth) / 2;
            const startY = 60;

            stateRef.current.invaders = levelSkills.map((skill, index) => {
                const col = index % cols;
                const row = Math.floor(index / cols);
                return {
                    id: index, name: skill.name, category: skill.category,
                    x: startX + col * (invaderWidth + paddingX),
                    y: startY + row * (invaderHeight + paddingY),
                    startY: startY + row * (invaderHeight + paddingY),
                    timeOffset: col * 0.5 + row * 0.5,
                    width: invaderWidth, height: invaderHeight,
                    hp: 1, maxHp: 1, isAlive: true
                };
            });
        }
    };

    const initGame = (difficulty: number = 1.0) => {
        if (!containerRef.current) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        stateRef.current.difficulty = difficulty;
        stateRef.current.player.x = width / 2 - 20;
        stateRef.current.player.y = height - 50;
        stateRef.current.player.stunnedUntil = 0;
        stateRef.current.player.hp = 3;
        stateRef.current.score = 0;
        stateRef.current.particles = [];
        stateRef.current.keys = {};
        stateRef.current.gameStartTime = Date.now();
        stateRef.current.level = 1;
        
        stateRef.current.stars = Array.from({ length: 100 }).map(() => ({
            x: Math.random() * width, y: Math.random() * height,
            speed: (Math.random() * 2 + 0.5) * difficulty, size: Math.random() * 2 + 1, brightness: Math.random()
        }));

        setUnlockedSkills([]);
        setCurrentLevel(1);
        setGameState('playing');
        spawnLevel(1, width, height);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const handleKeyDown = (e: KeyboardEvent) => { stateRef.current.keys[e.code] = true; };
        const handleKeyUp = (e: KeyboardEvent) => { stateRef.current.keys[e.code] = false; };
        
        const updatePlayerX = (clientX: number) => {
            const rect = canvas.getBoundingClientRect();
            const x = clientX - rect.left;
            stateRef.current.player.x = Math.max(
                0,
                Math.min(canvas.width - stateRef.current.player.width, x - stateRef.current.player.width / 2)
            );
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (gameState === 'playing') updatePlayerX(e.clientX);
        };
        const handleTouchMove = (e: TouchEvent) => {
            if (gameState !== 'playing') return;
            e.preventDefault();
            if (e.touches[0]) updatePlayerX(e.touches[0].clientX);
        };

        const fireProjectile = () => {
            const now = Date.now();
            if (now < stateRef.current.player.stunnedUntil) return;
            
            if (now - stateRef.current.lastShotTime > 150) { 
                stateRef.current.projectiles.push({
                    x: stateRef.current.player.x + stateRef.current.player.width / 2 - 2,
                    y: stateRef.current.player.y,
                    width: 4, height: 12, speed: 15
                });
                stateRef.current.lastShotTime = now;
            }
        };

        const handleMouseDown = () => { if (gameState === 'playing') fireProjectile(); };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        const handleTouchStart = (e: TouchEvent) => {
            handleTouchMove(e);
            if (gameState === 'playing') fireProjectile();
        };
        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });

        const resize = () => {
            if (!containerRef.current) return;
            canvas.width = containerRef.current.clientWidth;
            canvas.height = containerRef.current.clientHeight;
            stateRef.current.player.x = Math.max(0, Math.min(canvas.width - stateRef.current.player.width, stateRef.current.player.x));
            stateRef.current.player.y = canvas.height - 50;
        };
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(containerRef.current);
        resize();

        const createExplosion = (x: number, y: number, baseColor: string, isBig = false) => {
            const count = isBig ? 60 : 20;
            for (let i = 0; i < count; i++) {
                stateRef.current.particles.push({
                    x, y,
                    vx: (Math.random() - 0.5) * (isBig ? 25 : 10), vy: (Math.random() - 0.5) * (isBig ? 25 : 10),
                    life: 1, maxLife: Math.random() * 20 + 10,
                    color: i % 3 === 0 ? '#ffffff' : baseColor
                });
            }
        };

        const playerSprite = ['  #  ', ' ### ', '#####', '#####', '#   #'];
        const heartSprite = [' # # ', '#####', '#####', ' ### ', '  #  '];
        
        const invaderSpriteFrame1 = ['  ####  ', ' ###### ', '## ## ##', '########', '# #  # #', '#      #', ' #    # '];
        const invaderSpriteFrame2 = ['  ####  ', ' ###### ', '## ## ##', '########', '# #  # #', ' #    # ', '  #  #  '];
        
        // Sleeker, Deadlier Boss Sprite (Space Fighter)
        const bossSpriteFrame1 = [
            '         ###   ###         ',
            '       ####### #######     ',
            '      #### ### ### ####    ',
            '     ###    #   #    ###   ',
            '     ###   #######   ###   ',
            '      #### ####### ####    ',
            '       ###  # # #  ###     ',
            '        ##  # # #  ##      ',
            '         #  #   #  #       '
        ];
        
        const bossSpriteFrame2 = [
            '       ###       ###       ',
            '     #######   #######     ',
            '    #### ###   ### ####    ',
            '   ###    #     #    ###   ',
            '   ###   #########   ###   ',
            '    #### ######### ####    ',
            '     ###  #  #  #  ###     ',
            '      ##  #  #  #  ##      ',
            '       #  #     #  #       '
        ];

        const drawPixelSprite = (ctx: CanvasRenderingContext2D, sprite: string[], x: number, y: number, size: number, color: string) => {
            ctx.fillStyle = color;
            sprite.forEach((row, rowIndex) => {
                for (let colIndex = 0; colIndex < row.length; colIndex++) {
                    if (row[colIndex] === '#') ctx.fillRect(x + colIndex * size, y + rowIndex * size, size, size);
                }
            });
        };

        const update = () => {
            if (gameState !== 'playing' && gameState !== 'won') {
                requestRef.current = requestAnimationFrame(update);
                return;
            }

            const width = canvas.width;
            const height = canvas.height;
            const state = stateRef.current;
            const diff = state.difficulty;
            const now = Date.now();
            const elapsedTime = (now - state.gameStartTime) / 1000;

            if (gameState === 'playing') {
                if (state.keys['ArrowLeft'] || state.keys['KeyA']) state.player.x -= state.player.speed;
                if (state.keys['ArrowRight'] || state.keys['KeyD']) state.player.x += state.player.speed;
                if (state.player.x < 0) state.player.x = 0;
                if (state.player.x > width - state.player.width) state.player.x = width - state.player.width;
                if (state.keys['Space']) fireProjectile();
            }

            state.stars.forEach(star => {
                star.y += star.speed;
                if (star.y > height) { star.y = 0; star.x = Math.random() * width; }
            });

            if (gameState === 'playing') {
                state.projectiles.forEach(p => p.y -= p.speed);
                state.projectiles = state.projectiles.filter(p => p.y > 0);

                state.enemyProjectiles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                });
                state.enemyProjectiles = state.enemyProjectiles.filter(p => p.y < height && p.x > 0 && p.x < width);

                if (now > state.player.stunnedUntil) {
                    for (let i = state.enemyProjectiles.length - 1; i >= 0; i--) {
                        const ep = state.enemyProjectiles[i];
                        if (ep.x < state.player.x + state.player.width && ep.x + ep.width > state.player.x &&
                            ep.y < state.player.y + state.player.height && ep.y + ep.height > state.player.y) {
                            
                            state.player.hp -= 1;
                            if (state.player.hp <= 0) {
                                setFinalScore(state.score);
                                setGameState('gameover');
                            } else {
                                state.player.stunnedUntil = now + 1000; 
                            }
                            
                            state.enemyProjectiles.splice(i, 1);
                            createExplosion(state.player.x + state.player.width/2, state.player.y + state.player.height/2, '#ffffff');
                            break;
                        }
                    }
                }

                let hitWall = false;
                let aliveCount = 0;
                let bossRef: Invader | null = null;
                
                state.invaders.forEach(invader => {
                    if (invader.isAlive) {
                        aliveCount++;
                        invader.x += state.invaderSpeed * state.invaderDirection;
                        
                        if (invader.isBoss) {
                            bossRef = invader;
                            invader.y = invader.startY + Math.sin(elapsedTime * 4 * diff) * 30;
                            
                            if (invader.attackCooldown !== undefined) {
                                invader.attackCooldown--;
                                if (invader.attackCooldown <= 0) {
                                    const attackType = Math.floor(Math.random() * 3);
                                    const centerX = invader.x + invader.width / 2;
                                    const bottomY = invader.y + invader.height;

                                    if (attackType === 0) {
                                        [-3, 0, 3].forEach(vx => {
                                            state.enemyProjectiles.push({
                                                x: centerX, y: bottomY, width: 6, height: 16, vx: vx * diff, vy: 8 * diff, color: '#ff0055'
                                            });
                                        });
                                    } else if (attackType === 1) {
                                        const dx = (state.player.x + state.player.width/2) - centerX;
                                        const dy = state.player.y - bottomY;
                                        const mag = Math.sqrt(dx*dx + dy*dy);
                                        const speed = 12 * diff;
                                        state.enemyProjectiles.push({
                                            x: centerX, y: bottomY, width: 6, height: 16, 
                                            vx: (dx/mag) * speed, vy: (dy/mag) * speed, color: '#ff0055'
                                        });
                                    } else {
                                        for(let i=0; i< (4 * diff); i++) {
                                            state.enemyProjectiles.push({
                                                x: invader.x + Math.random() * invader.width, y: bottomY + Math.random()*20, 
                                                width: 6, height: 16, vx: (Math.random()-0.5)*2*diff, vy: 10 * diff, color: '#ff0055'
                                            });
                                        }
                                    }
                                    invader.attackCooldown = (Math.random() * 60 + 20) / diff;
                                }
                            }

                        } else {
                            invader.y = invader.startY + Math.sin(elapsedTime * 3 * diff + invader.timeOffset) * 20;
                            const fireChance = 0.002 * state.level * diff; 
                            if (Math.random() < fireChance) {
                                state.enemyProjectiles.push({
                                    x: invader.x + invader.width / 2, y: invader.y + invader.height,
                                    width: 4, height: 12, vx: 0, vy: (7 + state.level) * diff, color: categoryColors[invader.category] || '#a2e872'
                                });
                            }
                        }

                        if (invader.x <= 0 || invader.x + invader.width >= width) hitWall = true;
                    }
                });

                if (aliveCount === 0) {
                    if (state.level < 4) {
                        state.level++;
                        setCurrentLevel(state.level);
                        spawnLevel(state.level, width, height);
                    } else {
                        setFinalScore(state.score);
                        setGameState('won');
                    }
                }

                if (!state.invaders[0]?.isBoss && hitWall) {
                    state.invaderDirection *= -1;
                    state.invaders.forEach(invader => { if (invader.isAlive) invader.startY += 15 * diff; });
                } else if (state.invaders[0]?.isBoss && hitWall) {
                    state.invaderDirection *= -1; 
                }

                state.projectiles.forEach((p, pIndex) => {
                    state.invaders.forEach(invader => {
                        if (invader.isAlive && p.x < invader.x + invader.width && p.x + p.width > invader.x &&
                            p.y < invader.y + invader.height && p.y + p.height > invader.y) {
                            
                            invader.hp -= 1;
                            state.projectiles.splice(pIndex, 1);
                            state.score += 50 * diff; 
                            
                            if (invader.hp <= 0) {
                                invader.isAlive = false;
                                state.score += invader.isBoss ? (10000 * diff) : (200 * diff); 
                                const color = categoryColors[invader.category] || '#a2e872';
                                createExplosion(invader.x + invader.width / 2, invader.y + invader.height / 2, color, invader.isBoss);
                                
                                if (!invader.isBoss) {
                                    setUnlockedSkills(prev => {
                                        if (!prev.includes(invader.name)) return [...prev, invader.name];
                                        return prev;
                                    });
                                }
                            } else {
                                createExplosion(p.x, p.y, '#ffffff'); 
                            }
                        }
                    });
                });
            } else if (gameState === 'won') {
                if (Math.random() < 0.05) {
                    createExplosion(Math.random() * width, Math.random() * height, `hsl(${Math.random() * 360}, 100%, 50%)`, true);
                }
            }

            state.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.life++; });
            state.particles = state.particles.filter(p => p.life < p.maxLife);

            // ---------------- DRAWING ---------------- //
            ctx.fillStyle = 'rgba(10, 10, 15, 1)';
            ctx.fillRect(0, 0, width, height);

            state.stars.forEach(star => {
                ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
                ctx.fillRect(star.x, star.y, star.size, star.size);
            });

            ctx.strokeStyle = 'rgba(204, 255, 0, 0.03)';
            ctx.lineWidth = 1;
            for(let i=0; i<width; i+=40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
            for(let i=0; i<height; i+=40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }

            if (gameState === 'playing') {
                const isFrame1 = Math.floor(elapsedTime * 2) % 2 === 0;
                const isBossFrame1 = Math.floor(elapsedTime * 6) % 2 === 0; 

                state.invaders.forEach(invader => {
                    if (invader.isAlive) {
                        const color = categoryColors[invader.category] || '#a2e872';
                        const pixelSize = invader.isBoss ? (width < 400 ? 3 : 6) : (width < 400 ? 2 : 3);
                        const sprite = invader.isBoss ? (isBossFrame1 ? bossSpriteFrame1 : bossSpriteFrame2) : (isFrame1 ? invaderSpriteFrame1 : invaderSpriteFrame2);
                        const spriteWidth = sprite[0].length * pixelSize;
                        const spriteHeight = sprite.length * pixelSize;
                        const spriteX = invader.x + invader.width/2 - spriteWidth/2;
                        const spriteY = invader.y - spriteHeight + 10;

                        drawPixelSprite(ctx, sprite, spriteX, spriteY, pixelSize, color);

                        if (!invader.isBoss) {
                            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                            ctx.fillRect(invader.x + 5, invader.y + 12, invader.width - 10, invader.height - 14);
                            ctx.strokeStyle = color;
                            ctx.lineWidth = 1;
                            ctx.strokeRect(invader.x + 5, invader.y + 12, invader.width - 10, invader.height - 14);
                            ctx.fillStyle = color;
                            ctx.font = `bold ${width < 400 ? 9 : 11}px "Courier New", monospace`;
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(invader.name.toUpperCase(), invader.x + invader.width / 2, invader.y + 12 + (invader.height - 14) / 2);
                        }
                    }
                });

                ctx.fillStyle = '#00ffff';
                state.projectiles.forEach(p => {
                    ctx.fillRect(p.x, p.y, p.width, p.height / 2 - 2);
                    ctx.fillRect(p.x, p.y + p.height / 2 + 2, p.width, p.height / 2 - 2);
                });

                state.enemyProjectiles.forEach(p => {
                    ctx.fillStyle = p.color;
                    ctx.fillRect(p.x, p.y, p.width, p.height / 2 - 2);
                    ctx.fillRect(p.x, p.y + p.height / 2 + 2, p.width, p.height / 2 - 2);
                });

                const isStunned = now < state.player.stunnedUntil;
                if (!isStunned || Math.floor(now / 100) % 2 === 0) {
                    const playerPixelSize = 6;
                    const pSpriteWidth = 5 * playerPixelSize;
                    const pSpriteX = state.player.x + state.player.width/2 - pSpriteWidth/2;
                    drawPixelSprite(ctx, playerSprite, pSpriteX, state.player.y, playerPixelSize, isStunned ? '#ff0055' : '#a2e872');
                }

                const bossInvader = state.invaders.find(i => i.isBoss && i.isAlive);
                if (bossInvader) {
                    const barWidth = Math.min(200, width * 0.5);
                    const barX = width - 20 - barWidth;
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                    ctx.fillRect(barX, 50, barWidth, 12);
                    ctx.strokeStyle = '#ff0055';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(barX, 50, barWidth, 12);
                    ctx.fillStyle = '#ff0055';
                    ctx.fillRect(barX + 2, 52, (barWidth - 4) * (bossInvader.hp / bossInvader.maxHp), 8);
                    
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 10px "Courier New", monospace';
                    ctx.textAlign = 'right';
                    ctx.textBaseline = 'top';
                    ctx.fillText('SYSTEM ARCHITECT', width - 20, 68);
                }
            }

            state.particles.forEach(p => {
                ctx.fillStyle = p.color;
                ctx.globalAlpha = 1 - (p.life / p.maxLife);
                ctx.fillRect(p.x, p.y, 4, 4);
            });
            ctx.globalAlpha = 1;

            if (gameState === 'playing') {
                ctx.fillStyle = '#ffffff';
                ctx.font = `bold ${width < 400 ? 12 : 16}px "Courier New", monospace`;
                ctx.textAlign = 'right';
                ctx.textBaseline = 'top';
                ctx.fillText(`SCORE: ${state.score.toString().padStart(6, '0')}`, width - 10, 10);

                const heartSize = 3;
                for(let i=0; i<state.player.maxHp; i++) {
                    drawPixelSprite(ctx, heartSprite, width - 20 - (state.player.maxHp * 20) + (i * 20), 30, heartSize, i < state.player.hp ? '#ff0055' : '#333333');
                }
            }

            requestRef.current = requestAnimationFrame(update);
        };

        requestRef.current = requestAnimationFrame(update);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('touchmove', handleTouchMove);
            canvas.removeEventListener('touchstart', handleTouchStart);
            resizeObserver.disconnect();
        };
    }, [gameState]);

    return (
        <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-dark-950 relative overflow-hidden font-sans border-t border-dark-800">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neon/5 via-dark-900/10 to-dark-950 pointer-events-none" />

            <div className="max-w-7xl mx-auto mb-8 relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white uppercase tracking-wider mb-2">
                    Skills <span className="text-neon">Invaders</span>
                </h2>
                <p className="text-gray-400 font-mono text-sm max-w-2xl mx-auto">
                    Survive the waves, defeat the Architect, and unlock the tech stack.
                </p>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="glass-soft flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-4 py-2 sm:py-3 px-3 sm:px-6 rounded-full text-[10px] sm:text-xs font-mono text-gray-300">
                    <span className="flex items-center gap-1 sm:gap-2"><Gamepad2 className="w-3 h-3 sm:w-4 sm:h-4 text-neon" /> <strong>MOVE:</strong> Touch Drag / Arrows</span>
                    <span className="flex items-center gap-1 sm:gap-2"><MousePointerClick className="w-3 h-3 sm:w-4 sm:h-4 text-neon" /> <strong>SHOOT:</strong> Tap / Click / Space</span>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Game Container */}
                    <div 
                        ref={containerRef}
                        className="flex-[2] h-[420px] sm:h-[60vh] max-h-[700px] min-h-[420px] sm:min-h-[450px] border border-dark-600 rounded-[2rem] bg-dark-950 overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)] cursor-crosshair"
                    >
                        <canvas ref={canvasRef} className="block h-full w-full touch-none" />

                        {gameState === 'playing' && currentLevel <= 3 && (
                            <div className="absolute top-4 left-4 text-neon font-mono text-sm font-bold opacity-70">
                                WAVE {currentLevel}/3
                            </div>
                        )}

                        {gameState === 'playing' && currentLevel === 4 && (
                            <div className="absolute top-4 left-0 right-0 text-center text-red-500 font-display text-xl font-bold animate-pulse tracking-widest pointer-events-none">
                                WARNING: SYSTEM ARCHITECT DETECTED
                            </div>
                        )}

                        {gameState === 'start' && (
                            <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 sm:gap-6 p-4" style={{ imageRendering: 'pixelated' }}>
                                <h3 className="text-neon text-2xl sm:text-4xl mb-2 sm:mb-4 tracking-[0.2em] sm:tracking-[0.3em] uppercase" style={{ fontFamily: '"Courier New", monospace', fontWeight: 'bold' }}>
                                    SYSTEM READY
                                </h3>
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none sm:w-auto">
                                    <button 
                                        onClick={() => initGame(1.0)}
                                        className="w-full sm:w-auto px-6 py-3 bg-transparent border-4 border-gray-400 text-gray-400 font-bold hover:bg-gray-400 hover:text-dark-900 transition-colors uppercase"
                                        style={{ fontFamily: '"Courier New", monospace', fontSize: '16px' }}
                                    >
                                        [ EASY ]
                                    </button>
                                    <button 
                                        onClick={() => initGame(1.5)}
                                        className="w-full sm:w-auto px-6 py-3 bg-transparent border-4 border-neon text-neon font-bold hover:bg-neon hover:text-dark-900 transition-colors uppercase animate-pulse"
                                        style={{ fontFamily: '"Courier New", monospace', fontSize: '16px' }}
                                    >
                                        [ NORMAL ]
                                    </button>
                                    <button 
                                        onClick={() => initGame(2.5)}
                                        className="w-full sm:w-auto px-6 py-3 bg-transparent border-4 border-red-500 text-red-500 font-bold hover:bg-red-500 hover:text-dark-900 transition-colors uppercase"
                                        style={{ fontFamily: '"Courier New", monospace', fontSize: '16px' }}
                                    >
                                        [ HARDCORE ]
                                    </button>
                                </div>
                            </div>
                        )}

                        {gameState === 'gameover' && (
                            <div className="absolute inset-0 bg-dark-950/90 flex flex-col items-center justify-center text-center p-4 sm:p-8 border-4 border-red-500/50">
                                <h3 className="text-red-500 text-3xl sm:text-5xl mb-4 tracking-[0.1em] sm:tracking-[0.2em] uppercase" style={{ fontFamily: '"Courier New", monospace', fontWeight: 'bold', textShadow: '4px 4px 0px #660000' }}>
                                    GAME OVER
                                </h3>
                                <p className="text-white text-lg sm:text-xl mb-6 sm:mb-8 tracking-widest" style={{ fontFamily: '"Courier New", monospace' }}>
                                    SCORE: {finalScore.toString().padStart(6, '0')}
                                </p>
                                <button 
                                    onClick={() => setGameState('start')}
                                    className="px-6 py-3 bg-transparent border-4 border-red-500 text-red-500 font-bold uppercase hover:bg-red-500 hover:text-white transition-colors"
                                    style={{ fontFamily: '"Courier New", monospace', fontSize: '16px' }}
                                >
                                    &gt; INSERT COIN &lt;
                                </button>
                            </div>
                        )}

                        {gameState === 'won' && (
                            <div className="absolute inset-0 bg-dark-950/70 flex flex-col items-center justify-center text-center p-4 sm:p-8 border-4 border-neon/50">
                                <div className="animate-bounce">
                                    <h3 className="text-neon text-4xl sm:text-6xl md:text-7xl mb-4 sm:mb-6 tracking-[0.05em] sm:tracking-[0.1em] uppercase" style={{ fontFamily: '"Courier New", monospace', fontWeight: '900', textShadow: '4px 4px 0px #334400, 0 0 20px #a2e872' }}>
                                        YOU WINNER
                                    </h3>
                                </div>
                                <p className="text-white text-xl sm:text-2xl mb-6 sm:mb-10 tracking-widest" style={{ fontFamily: '"Courier New", monospace', fontWeight: 'bold' }}>
                                    FINAL SCORE: {finalScore.toString().padStart(6, '0')}
                                </p>
                                <button 
                                    onClick={() => setGameState('start')}
                                    className="px-6 sm:px-8 py-3 sm:py-4 bg-neon text-dark-900 border-4 border-neon font-bold uppercase hover:bg-white hover:border-white transition-colors z-10"
                                    style={{ fontFamily: '"Courier New", monospace', fontSize: '18px' }}
                                >
                                    [ CLAIM BOUNTY ]
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Unlocked Skills Sidebar */}
                    <div className="glass-surface flex-1 rounded-[2rem] p-6 h-fit shadow-xl flex flex-col">
                        <div className="flex items-center justify-between border-b border-dark-700 pb-4 mb-4">
                            <h4 className="text-white font-display uppercase tracking-widest text-sm">
                                Tech Stack
                            </h4>
                            <span className="glass-chip text-neon font-mono text-xs font-bold px-2 py-1 rounded-full">
                                {unlockedSkills.length} / {skillsList.length}
                            </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-8">
                            {skillsList.map(skill => {
                                const isUnlocked = unlockedSkills.includes(skill.name);
                                const color = categoryColors[skill.category] || '#a2e872';
                                
                                return (
                                    <div 
                                        key={skill.name}
                                        className={`px-3 py-1.5 border rounded-full text-xs font-mono transition-all duration-700
                                            ${isUnlocked 
                                                ? 'bg-dark-800 shadow-sm' 
                                                : 'bg-transparent border-dark-700 text-dark-600 opacity-40'
                                            }
                                        `}
                                        style={{ 
                                            borderColor: isUnlocked ? color : '',
                                            color: isUnlocked ? color : '',
                                            boxShadow: isUnlocked ? `0 0 10px ${color}30` : ''
                                        }}
                                    >
                                        {skill.name}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Legal Disclaimer */}
                        <div className="mt-auto pt-4 border-t border-dark-800">
                            <p className="text-[10px] text-gray-500 font-mono opacity-60 leading-tight">
                                A non-commercial technical homage inspired by classic arcades. "Space Invaders" is a registered trademark of Taito Corporation. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
