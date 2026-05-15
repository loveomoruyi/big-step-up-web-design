// Plexus Digital FX Technology Background Animation
// Enhanced with golden streaming highlights, breathing effects, and shape highlighting

(function() {
    var canvas = document.createElement('canvas');
    canvas.id = 'plexus-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
    document.body.insertBefore(canvas, document.body.firstChild);
    var ctx = canvas.getContext('2d');
    var width, height, particles = [], mouse = {x:null,y:null,radius:150};
    var config = {count:80,size:2,lineDist:150,speed:0.5,color:'200,180,130'};
    var time = 0;
    var highlightedShapes = [];
    var streamingLines = [];
    var breathCycle = 0;

    function resize(){width=canvas.width=window.innerWidth;height=canvas.height=window.innerHeight;}

    function Particle(){
        this.x=Math.random()*width;
        this.y=Math.random()*height;
        this.vx=(Math.random()-0.5)*config.speed;
        this.vy=(Math.random()-0.5)*config.speed;
        this.size=Math.random()*config.size+0.5;
        this.opacity=Math.random()*0.5+0.3;
        this.baseOpacity=this.opacity;
    }

    Particle.prototype.update=function(){
        if(mouse.x!==null){
            var dx=this.x-mouse.x,dy=this.y-mouse.y,dist=Math.sqrt(dx*dx+dy*dy);
            if(dist<mouse.radius){
                var force=(mouse.radius-dist)/mouse.radius;
                this.vx+=dx/dist*force*0.02;
                this.vy+=dy/dist*force*0.02;
            }
        }
        var spd=Math.sqrt(this.vx*this.vx+this.vy*this.vy);
        if(spd>config.speed*2){this.vx=this.vx/spd*config.speed*2;this.vy=this.vy/spd*config.speed*2;}
        this.x+=this.vx;this.y+=this.vy;
        if(this.x<0||this.x>width)this.vx*=-1;
        if(this.y<0||this.y>height)this.vy*=-1;
        if(this.x<0)this.x=0;if(this.x>width)this.x=width;
        if(this.y<0)this.y=0;if(this.y>height)this.y=height;
        // Breathing effect on particle opacity
        this.opacity = this.baseOpacity + Math.sin(time * 0.002 + this.x * 0.01) * 0.15;
    };

    Particle.prototype.draw=function(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
        ctx.fillStyle='rgba('+config.color+','+this.opacity+')';
        ctx.fill();
    };

    function init(){
        particles=[];
        for(var i=0;i<config.count;i++)particles.push(new Particle());
        // Initialize streaming lines
        for(var i=0;i<5;i++){
            streamingLines.push({
                startIdx: Math.floor(Math.random()*config.count),
                endIdx: Math.floor(Math.random()*config.count),
                progress: 0,
                speed: 0.005 + Math.random()*0.008,
                active: true,
                delay: Math.random()*200
            });
        }
    }

    // Find triangles/polygons formed by connected particles
    function findShapes(){
        var shapes = [];
        var len = particles.length;
        for(var i=0;i<len;i++){
            for(var j=i+1;j<len;j++){
                var dx1=particles[i].x-particles[j].x;
                var dy1=particles[i].y-particles[j].y;
                var d1=Math.sqrt(dx1*dx1+dy1*dy1);
                if(d1>config.lineDist)continue;
                for(var k=j+1;k<len;k++){
                    var dx2=particles[i].x-particles[k].x;
                    var dy2=particles[i].y-particles[k].y;
                    var d2=Math.sqrt(dx2*dx2+dy2*dy2);
                    if(d2>config.lineDist)continue;
                    var dx3=particles[j].x-particles[k].x;
                    var dy3=particles[j].y-particles[k].y;
                    var d3=Math.sqrt(dx3*dx3+dy3*dy3);
                    if(d3>config.lineDist)continue;
                    // Found a triangle
                    shapes.push({
                        points:[particles[i],particles[j],particles[k]],
                        avgDist:(d1+d2+d3)/3
                    });
                    if(shapes.length>15)return shapes; // Limit for performance
                }
            }
        }
        return shapes;
    }

    // Update highlighted shapes periodically
    var shapeTimer = 0;
    function updateHighlightedShapes(){
        shapeTimer++;
        if(shapeTimer % 120 === 0){ // Every ~2 seconds at 60fps
            var allShapes = findShapes();
            highlightedShapes = [];
            // Pick 3-5 random shapes to highlight
            var count = Math.min(allShapes.length, 3 + Math.floor(Math.random()*3));
            var shuffled = allShapes.sort(function(){return Math.random()-0.5;});
            for(var i=0;i<count;i++){
                highlightedShapes.push({
                    shape: shuffled[i],
                    fadeIn: 0,
                    phase: Math.random() * Math.PI * 2
                });
            }
        }
    }

    // Draw shapes with golden pulsing fill
    function drawShapes(){
        for(var i=0;i<highlightedShapes.length;i++){
            var hs = highlightedShapes[i];
            if(!hs || !hs.shape)continue;
            var pts = hs.shape.points;
            // Breathing/pulsing opacity
            hs.fadeIn = Math.min(hs.fadeIn + 0.02, 1);
            var pulse = Math.sin(time * 0.003 + hs.phase) * 0.5 + 0.5;
            var alpha = pulse * 0.06 * hs.fadeIn; // Very subtle golden fill

            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            ctx.lineTo(pts[1].x, pts[1].y);
            ctx.lineTo(pts[2].x, pts[2].y);
            ctx.closePath();

            // Golden gradient fill
            var centerX = (pts[0].x + pts[1].x + pts[2].x) / 3;
            var centerY = (pts[0].y + pts[1].y + pts[2].y) / 3;
            var grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, hs.shape.avgDist * 0.7);
            grad.addColorStop(0, 'rgba(255, 200, 80, ' + (alpha * 1.5) + ')');
            grad.addColorStop(0.5, 'rgba(218, 165, 50, ' + alpha + ')');
            grad.addColorStop(1, 'rgba(180, 130, 40, ' + (alpha * 0.3) + ')');
            ctx.fillStyle = grad;
            ctx.fill();
        }
    }

    function drawLines(){
        var len=particles.length;
        for(var i=0;i<len;i++){
            for(var j=i+1;j<len;j++){
                var dx=particles[i].x-particles[j].x;
                var dy=particles[i].y-particles[j].y;
                var dist=Math.sqrt(dx*dx+dy*dy);
                if(dist<config.lineDist){
                    var baseAlpha = (1-dist/config.lineDist)*0.4;
                    // Base line with subtle breathing
                    var breathAlpha = baseAlpha * (0.8 + Math.sin(breathCycle + i*0.1)*0.2);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x,particles[i].y);
                    ctx.lineTo(particles[j].x,particles[j].y);
                    ctx.strokeStyle='rgba('+config.color+','+breathAlpha+')';
                    ctx.lineWidth=0.5;
                    ctx.stroke();
                }
            }
        }
    }

    // Draw golden streaming highlights along lines
    function drawStreamingHighlights(){
        var len = particles.length;
        for(var s=0;s<streamingLines.length;s++){
            var stream = streamingLines[s];
            if(time < stream.delay)continue;

            stream.progress += stream.speed;
            if(stream.progress > 1){
                // Reset with new random connection
                stream.progress = 0;
                stream.startIdx = Math.floor(Math.random()*len);
                stream.endIdx = Math.floor(Math.random()*len);
                stream.speed = 0.005 + Math.random()*0.008;
                stream.delay = time + Math.random()*60;
            }

            var p1 = particles[stream.startIdx];
            var p2 = particles[stream.endIdx];
            if(!p1 || !p2)continue;

            var dx = p2.x - p1.x;
            var dy = p2.y - p1.y;
            var dist = Math.sqrt(dx*dx+dy*dy);
            if(dist > config.lineDist * 1.5)continue; // Only highlight connected-ish lines

            // Calculate streaming point position
            var px = p1.x + dx * stream.progress;
            var py = p1.y + dy * stream.progress;

            // Golden streaming glow
            var streamAlpha = Math.sin(stream.progress * Math.PI) * 0.7; // Fade in/out along path
            var grad = ctx.createRadialGradient(px, py, 0, px, py, 20);
            grad.addColorStop(0, 'rgba(255, 215, 80, ' + (streamAlpha * 0.6) + ')');
            grad.addColorStop(0.4, 'rgba(218, 175, 50, ' + (streamAlpha * 0.3) + ')');
            grad.addColorStop(1, 'rgba(180, 140, 30, 0)');

            ctx.beginPath();
            ctx.arc(px, py, 20, 0, Math.PI*2);
            ctx.fillStyle = grad;
            ctx.fill();

            // Bright core line segment near the streaming point
            var segLen = 0.15; // Length of bright segment
            var segStart = Math.max(0, stream.progress - segLen/2);
            var segEnd = Math.min(1, stream.progress + segLen/2);
            var sx = p1.x + dx * segStart;
            var sy = p1.y + dy * segStart;
            var ex = p1.x + dx * segEnd;
            var ey = p1.y + dy * segEnd;

            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(ex, ey);
            var lineGrad = ctx.createLinearGradient(sx, sy, ex, ey);
            lineGrad.addColorStop(0, 'rgba(255, 200, 80, 0)');
            lineGrad.addColorStop(0.5, 'rgba(255, 215, 100, ' + (streamAlpha * 0.8) + ')');
            lineGrad.addColorStop(1, 'rgba(255, 200, 80, 0)');
            ctx.strokeStyle = lineGrad;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    // Draw additional ambient golden glow points that breathe
    function drawAmbientGlow(){
        var glowCount = 3;
        for(var i=0;i<glowCount;i++){
            var idx = Math.floor((time * 0.001 + i * 33.33) % particles.length);
            var p = particles[idx];
            if(!p)continue;
            var pulse = Math.sin(time * 0.002 + i * 2.1) * 0.5 + 0.5;
            var alpha = pulse * 0.15;
            var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 35);
            grad.addColorStop(0, 'rgba(255, 200, 80, ' + alpha + ')');
            grad.addColorStop(0.5, 'rgba(200, 160, 50, ' + (alpha*0.4) + ')');
            grad.addColorStop(1, 'rgba(150, 120, 30, 0)');
            ctx.beginPath();
            ctx.arc(p.x, p.y, 35, 0, Math.PI*2);
            ctx.fillStyle = grad;
            ctx.fill();
        }
    }

    function animate(){
        ctx.clearRect(0,0,width,height);
        time++;
        breathCycle += 0.015; // Slow breathing cycle

        // Update and draw particles
        particles.forEach(function(p){p.update();p.draw();});

        // Draw base connecting lines with breathing
        drawLines();

        // Draw golden streaming highlights
        drawStreamingHighlights();

        // Update and draw highlighted shapes
        updateHighlightedShapes();
        drawShapes();

        // Draw ambient glow
        drawAmbientGlow();

        requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove',function(e){mouse.x=e.clientX;mouse.y=e.clientY;});
    window.addEventListener('mouseout',function(){mouse.x=null;mouse.y=null;});
    window.addEventListener('resize',resize);

    resize();init();animate();

    // Smooth text animations
    function initTextAnim(){
        var eyebrow=document.querySelector('.hero-eyebrow');
        var lines=document.querySelectorAll('.title-line');
        var subtitle=document.querySelector('.hero-subtitle');
        var cta=document.querySelector('.hero-cta');
        if(eyebrow){eyebrow.style.opacity='0';eyebrow.style.transform='translateY(20px)';setTimeout(function(){eyebrow.style.transition='opacity 0.8s ease, transform 0.8s ease';eyebrow.style.opacity='1';eyebrow.style.transform='translateY(0)';},300);}
        lines.forEach(function(l,i){l.style.opacity='0';l.style.transform='translateY(40px)';setTimeout(function(){l.style.transition='opacity 0.8s ease, transform 0.8s ease';l.style.opacity='1';l.style.transform='translateY(0)';},500+i*200);});
        if(subtitle){subtitle.style.opacity='0';subtitle.style.transform='translateY(20px)';setTimeout(function(){subtitle.style.transition='opacity 0.8s ease, transform 0.8s ease';subtitle.style.opacity='1';subtitle.style.transform='translateY(0)';},1200);}
        if(cta){cta.style.opacity='0';cta.style.transform='translateY(20px)';setTimeout(function(){cta.style.transition='opacity 0.8s ease, transform 0.8s ease';cta.style.opacity='1';cta.style.transform='translateY(0)';},1500);}
    }
    if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initTextAnim);}else{initTextAnim();}
})();
