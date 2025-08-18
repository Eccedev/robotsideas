               
               const codificables = [
                    // Letras minúsculas y mayúsculas esperanto
                    'a', 'b', 'c', 'ĉ', 'd', 'e', 'f', 'g', 'ĝ', 'h', 'ĥ', 'i', 'j', 'ĵ', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 'ŝ', 't', 'u', 'ŭ', 'v', 'z',
                    'A', 'B', 'C', 'Ĉ', 'D', 'E', 'F', 'G', 'Ĝ', 'H', 'Ĥ', 'I', 'J', 'Ĵ', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'Ŝ', 'T', 'U', 'Ŭ', 'V', 'Z',
                    // Números
                    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                    // Signos pedidos
                    '.', ',', '!', '?', ';', ';', ':', '"', '\\', '(', ')', '[', ']', '{', '}', '+', '-', '*', '÷', '=', '^', '%', '&', '@', '#', '_', '´', '¨', '`', 'ç', 'Ç', '\'', '¡', '¿', '/', '*', '$', '·', '|'
                ];

                // 90 símbolos únicos (puedes cambiarlos por otros, pero deben ser únicos y tantos como codificables)
                const symbols = [
                    '⚘', '☊', '☠', '☣', '⚠', '☢', '☯', '☮', '✠', '✰', '❀', '❁', '❂', '❃', '❄', '❅', '❆', '❇', '❈', '❉', '❊', '❋', '✽', '✾', '✿', '★', '☆', '✦',
                    '⧫', '⧬', '⧭', '⧮', '⧯', '⧰', '⧱', '⧲', '⧳', '⧴', '⧵', '⧶', '⧷', '⧸', '⧹', '⧺', '⧻', '⧼', '⧽', '⧾', '⧿', '◆', '◇', '◈', '◉', '◊', '○', '●',
                    '♠', '♣', '♥', '♦', '♤', '♧', '♡', '♢', '♩', '♪', '♫', '♬', '♭', '♯', '♮', '⚡', '☀', '☁', '☂', '☃', '☄', '✱', '✲', '✳', '✴', '✵', '✶', '✷', '✸', '✹', '✺', '✻', '✼',
                    '☘', '☙', '☭', '☬', '☸', '☽', '☾', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐'
                ];

                if (codificables.length !== symbols.length) {
                    alert('El número de símbolos y caracteres codificables debe ser igual. Ahora: ' + codificables.length + ' y ' + symbols.length);
                }

                const shift = 5;
                const reverseOutput = true;

                document.getElementById('translate').addEventListener('click', function () {
                    const input = document.getElementById('input').value;
                    const direction = document.getElementById('direction').checked;
                    let output = direction ? decode(input) : encode(input);
                    document.getElementById('output').value = output;
                });

                function encode(text) {
                    let result = '';
                    for (let char of text) {
                        const index = codificables.indexOf(char);
                        if (index !== -1) {
                            const shiftedIndex = (index + shift) % codificables.length;
                            result += symbols[shiftedIndex];
                        } else {
                            result += char; // deja intactos los no codificables
                        }
                    }
                    if (reverseOutput) {
                        result = result.split('').reverse().join('');
                    }
                    return result;
                }

                function decode(text) {
                    let reversed = reverseOutput ? text.split('').reverse().join('') : text;
                    let result = '';
                    for (let char of reversed) {
                        const index = symbols.indexOf(char);
                        if (index !== -1) {
                            const originalIndex = (index - shift + symbols.length) % symbols.length;
                            result += codificables[originalIndex];
                        } else {
                            result += char;
                        }
                    }
                    return result;
                }
// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Selecciona el botón por su ID
    const toggleButton = document.getElementById('dark-toggle');

    // Añade el event listener
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
        });
    }
});

                // === Scroll to Top ===
                const scrollToTopButton = document.getElementById('scroll-to-top');

                window.addEventListener('scroll', () => {
                    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                        scrollToTopButton.style.display = 'block';
                    } else {
                        scrollToTopButton.style.display = 'none';
                    }
                });

                scrollToTopButton.addEventListener('click', () => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });

                //-------------------------------------------------------//
                //------------------------------------------------------//


                // === Funcionalidad Principal: Dibujo de QUID Card ===
                document.addEventListener('DOMContentLoaded', function () {
                    // Referencias a los elementos del formulario
                    const inputs = {
                        nombre: document.getElementById('input-nombre'),
                        apellido: document.getElementById('input-apellido'),
                        continente: document.getElementById('input-continente'),
                        datos: document.getElementById('input-datos'),
                        sueno: document.getElementById('input-sueno'),
                        imageUpload: document.getElementById('imageUpload')
                    };

                    // Referencias al canvas y su contexto
                    const canvas = document.getElementById('quid-card-canvas');
                    const ctx = canvas.getContext('2d');

                    // Dimensiones de la tarjeta en píxeles (10x7 cm a 300 DPI)
                    const CARD_WIDTH = 1181;
                    const CARD_HEIGHT = 827;
                    canvas.width = CARD_WIDTH;
                    canvas.height = CARD_HEIGHT;

                    let uploadedImage = null; // Variable para almacenar la imagen de perfil cargada
                    let backgroundImage = new Image(); // Variable para almacenar la imagen de fondo
                    backgroundImage.src = 'assets/bg-card.jpg';

                    // Función para envolver texto en múltiples líneas
                    function wrapText(context, text, x, y, maxWidth, lineHeight) {
                        const words = text.split(' ');
                        let line = '';
                        let testLine = '';
                        let metrics;
                        let testWidth;
                        for (let n = 0; n < words.length; n++) {
                            testLine = line + words[n] + ' ';
                            metrics = context.measureText(testLine);
                            testWidth = metrics.width;
                            if (testWidth > maxWidth && n > 0) {
                                context.fillText(line.trim(), x, y);
                                line = words[n] + ' ';
                                y += lineHeight;
                            } else {
                                line = testLine;
                            }
                        }
                        context.fillText(line.trim(), x, y);
                        return y + lineHeight;
                    }

                    // Extensión para dibujar rectángulos redondeados
                    if (!CanvasRenderingContext2D.prototype.roundRect) {
                        CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
                            if (typeof radius === 'number') {
                                radius = { tl: radius, tr: radius, br: radius, bl: radius };
                            } else if (typeof radius === 'object') {
                                radius = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...radius };
                            } else {
                                radius = { tl: 0, tr: 0, br: 0, bl: 0 };
                            }
                            this.beginPath();
                            this.moveTo(x + radius.tl, y);
                            this.lineTo(x + width - radius.tr, y);
                            this.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
                            this.lineTo(x + width, y + height - radius.br);
                            this.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
                            this.lineTo(x + radius.bl, y + height);
                            this.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
                            this.lineTo(x, y + radius.tl);
                            this.quadraticCurveTo(x, y, x + radius.tl, y);
                            this.closePath();
                            return this;
                        };
                    }

                    // Función principal para dibujar la QUID Card en el canvas
                    async function drawQuidCard() {
                        ctx.clearRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

                        // 1. Fondo
                        await new Promise((resolve, reject) => {
                            if (backgroundImage.complete && backgroundImage.naturalWidth !== 0) {
                                resolve();
                            } else {
                                backgroundImage.onload = resolve;
                                backgroundImage.onerror = () => {
                                    ctx.fillStyle = '#cfe8ff';
                                    ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
                                    resolve();
                                };
                            }
                        });
                        ctx.drawImage(backgroundImage, 0, 0, CARD_WIDTH, CARD_HEIGHT);

                        // 2. Título y logo
                        ctx.fillStyle = '#fff';
                        ctx.font = 'bold 60px "Comic Sans MS"';
                        ctx.fillText('QUID Card', 40, 90);
                        ctx.font = '24px "Comic Sans MS"';
                        ctx.fillStyle = '#f2f2f2';
                        ctx.fillText('Quantum Universe Identifier', 40, 125);
                        ctx.strokeStyle = '#87c0f5';
                        ctx.lineWidth = 5;
                        ctx.beginPath();
                        ctx.moveTo(40, 150);
                        ctx.lineTo(CARD_WIDTH - 40, 150);
                        ctx.stroke();
                        ctx.fillStyle = '#cfe8ff15';
                        ctx.beginPath();
                        ctx.arc(CARD_WIDTH - 320, 95, 10, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.strokeStyle = '#cfe8ff36';
                        ctx.lineWidth = 8;
                        ctx.stroke();
                        ctx.fillStyle = '#fff';
                        ctx.font = 'bold 110px "Comic Sans MS"';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText('QUN', CARD_WIDTH - 150, 95);
                        ctx.textAlign = 'left';
                        ctx.textBaseline = 'alphabetic';

                        // 3. Info: calcular alturas de campos
                        const photoX = 40;
                        const photoY = 200;
                        const photoSize = 350;
                        const infoStartX = photoX + photoSize + 40;
                        const infoStartY = 200;
                        const infoWidth = CARD_WIDTH - infoStartX - 40;
                        const fieldGap = 20;
                        const labelFontSize = 20;
                        const textFontSize = 28;
                        const textLineHeight = textFontSize * 1.4;

                        function calculateFieldHeight(textContent, maxLength) {
                            let displayContent = textContent;
                            if (maxLength && textContent.length > maxLength) {
                                displayContent = textContent.substring(0, maxLength);
                            }
                            ctx.font = `${textFontSize}px "Comic Sans MS"`;
                            const words = displayContent.split(' ');
                            let lines = [];
                            let currentLine = '';
                            for (let i = 0; i < words.length; i++) {
                                const testLine = currentLine + words[i] + ' ';
                                if (ctx.measureText(testLine).width > (infoWidth - 30) && i > 0) {
                                    lines.push(currentLine.trim());
                                    currentLine = words[i] + ' ';
                                } else {
                                    currentLine = testLine;
                                }
                            }
                            lines.push(currentLine.trim());
                            return labelFontSize + 5 + (lines.length * textLineHeight) + 20;
                        }

                        const fieldHeights = [
                            calculateFieldHeight((inputs.nombre.value.trim() || 'Nombre') + ' ' + (inputs.apellido.value.trim() || 'Apellido'), 45),
                            calculateFieldHeight(inputs.continente.value.trim() || 'Continente Actual', 49),
                            calculateFieldHeight(inputs.datos.value.trim() || 'Datos interesantes sobre ti o tu especie.', 49),
                            calculateFieldHeight(inputs.sueno.value.trim() || 'Tu meta mas ambiciosa para el universo.', 49)
                        ];
                        const alturaTotalDeLaSeccion = fieldHeights.reduce((a, b) => a + b, 0) + fieldGap * (fieldHeights.length - 1);

                        // 4. Fondo único para toda la sección de info
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                        ctx.roundRect(infoStartX, infoStartY, infoWidth, alturaTotalDeLaSeccion, 10);
                        ctx.fill();

                        // 5. Dibuja los campos de info sin fondo individual
                        let currentY = infoStartY;
                        function drawInfoField(label, textContent, maxLength) {
                            let displayContent = textContent;
                            if (maxLength && textContent.length > maxLength) {
                                displayContent = textContent.substring(0, maxLength);
                            }
                            ctx.fillStyle = '#3182ce';
                            ctx.font = `bold ${labelFontSize}px "Comic Sans MS"`;
                            ctx.fillText(label, infoStartX + 15, currentY + 10 + labelFontSize);
                            ctx.fillStyle = '#333';
                            ctx.font = `${textFontSize}px "Comic Sans MS"`;
                            const textY = currentY + 10 + labelFontSize + 5 + textLineHeight;
                            wrapText(ctx, displayContent, infoStartX + 15, textY, infoWidth - 30, textLineHeight);
                            currentY = currentY + fieldHeights.shift() + fieldGap;
                        }

                        drawInfoField('NOMBRE / APELLIDO', (inputs.nombre.value.trim() || 'Nombre') + ' ' + (inputs.apellido.value.trim() || 'Apellido'), 45);
                        drawInfoField('CONTINENTE', inputs.continente.value.trim() || 'Continente Actual', 49);
                        drawInfoField('DATOS CURIOSOS', inputs.datos.value.trim() || 'Datos interesantes sobre ti o tu especie.', 49);
                        drawInfoField('SUEÑO FUTURO', inputs.sueno.value.trim() || 'Tu meta mas ambiciosa para el universo.', 49);

                        // 6. Sección de la foto (AL FINAL, para que quede por encima del fondo blanco)
                        if (!uploadedImage) {
                            ctx.fillStyle = '#adcdea';
                            ctx.roundRect(photoX, photoY, photoSize, photoSize, 20);
                            ctx.fill();
                            ctx.strokeStyle = '#fff';
                            ctx.lineWidth = 10;
                            ctx.roundRect(photoX, photoY, photoSize, photoSize, 20);
                            ctx.stroke();
                            ctx.fillStyle = '#fff';
                            ctx.font = '24px "Comic Sans MS"';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('Imagen', photoX + photoSize / 2, photoY + photoSize / 2);
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'alphabetic';
                        } else {
                            // Si hay imagen, recorta con clip para bordes redondeados
                            ctx.save();
                            ctx.beginPath();
                            ctx.moveTo(photoX + 20, photoY);
                            ctx.lineTo(photoX + photoSize - 20, photoY);
                            ctx.quadraticCurveTo(photoX + photoSize, photoY, photoX + photoSize, photoY + 20);
                            ctx.lineTo(photoX + photoSize, photoY + photoSize - 20);
                            ctx.quadraticCurveTo(photoX + photoSize, photoY + photoSize, photoX + photoSize - 20, photoY + photoSize);
                            ctx.lineTo(photoX + 20, photoY + photoSize);
                            ctx.quadraticCurveTo(photoX, photoY + photoSize, photoX, photoY + photoSize - 20);
                            ctx.lineTo(photoX, photoY + 20);
                            ctx.quadraticCurveTo(photoX, photoY, photoX + 20, photoY);
                            ctx.closePath();
                            ctx.clip();
                            // Dibuja la imagen ocupando todo el recuadro
                            ctx.drawImage(uploadedImage, photoX, photoY, photoSize, photoSize);
                            ctx.restore();
                            // Dibuja el borde blanco encima
                            ctx.strokeStyle = '#fff';
                            ctx.lineWidth = 10;
                            ctx.roundRect(photoX, photoY, photoSize, photoSize, 20);
                            ctx.stroke();
                        }

                        // 7. Footer
                        ctx.fillStyle = '#ffffff';
                        ctx.font = '24px "Comic Sans MS"';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'alphabetic';
                        const footerText = 'robotsideas.com: un futuro emocionante y entretivertido para todos los seres del universo.';
                        const footerY = CARD_HEIGHT - 40;
                        ctx.strokeStyle = '#87c0f5';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(40, footerY - 30);
                        ctx.lineTo(CARD_WIDTH - 40, footerY - 30);
                        ctx.stroke();
                        ctx.textAlign = 'center';
                        wrapText(ctx, footerText, CARD_WIDTH / 2, footerY, CARD_WIDTH - 80, 25);
                        ctx.textAlign = 'left';
                    }

                    // Eventos de actualización
                    inputs.nombre.addEventListener('input', drawQuidCard);
                    inputs.apellido.addEventListener('input', drawQuidCard);
                    inputs.continente.addEventListener('input', drawQuidCard);
                    inputs.datos.addEventListener('input', drawQuidCard);
                    inputs.sueno.addEventListener('input', drawQuidCard);

                    // Imagen de perfil
                    inputs.imageUpload.addEventListener('change', (event) => {
                        const file = event.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                const img = new Image();
                                img.onload = () => {
                                    uploadedImage = img;
                                    drawQuidCard();
                                };
                                img.src = e.target.result;
                            };
                            reader.readAsDataURL(file);
                        } else {
                            uploadedImage = null;
                            drawQuidCard();
                        }
                    });

                    // Descarga
                    document.getElementById('download-btn').addEventListener('click', async () => {
                        await drawQuidCard();
                        const link = document.createElement('a');
                        link.href = canvas.toDataURL('image/jpeg', 0.95);
                        const nombre = inputs.nombre.value || 'ciudadano';
                        const apellido = inputs.apellido.value || 'universal';
                        link.download = `QUID-Card-${nombre.replace(/\s+/g, '_')}-${apellido.replace(/\s+/g, '_')}.jpg`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    });

                    // Inicialización
                    backgroundImage.onload = () => {
                        drawQuidCard();
                    };
                    if (backgroundImage.complete && backgroundImage.naturalWidth !== 0) {
                        drawQuidCard();
                    }
                });