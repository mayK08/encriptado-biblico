class BibleCipher {
    constructor() {
        this.apiUrl = 'https://bible-api.com';
        this.verseCache = new Map();
    }

    async getVerse(reference) {
        if (this.verseCache.has(reference)) {
            return this.verseCache.get(reference);
        }

        try {
            const response = await fetch(`${this.apiUrl}/${reference}`);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            const verseText = data.text.replace(/\s+/g, ' ').trim();
            
            this.verseCache.set(reference, verseText);
            return verseText;
        } catch (error) {
            console.error('Error obteniendo versículo:', error);
            throw new Error(`No se pudo obtener el versículo: ${reference}`);
        }
    }

    // Método CORRECTO de cifrado XOR
    async encrypt(message, reference) {
        try {
            const verse = await this.getVerse(reference);
            const key = this.prepareKey(verse, message.length);
            
            console.log('CIFRANDO:');
            console.log('Mensaje:', message);
            console.log('Clave:', key);
            
            let encrypted = '';
            for (let i = 0; i < message.length; i++) {
                const messageChar = message.charCodeAt(i);
                const keyChar = key.charCodeAt(i % key.length);
                
                // XOR entre los códigos ASCII
                const encryptedChar = messageChar ^ keyChar;
                encrypted += String.fromCharCode(encryptedChar);
                
                console.log(`Char ${i}: '${message[i]}' (${messageChar}) XOR '${key[i % key.length]}' (${keyChar}) = ${encryptedChar}`);
            }
            
            // Convertir a base64 para manejar caracteres no imprimibles
            const base64Encoded = btoa(encrypted);
            
            console.log('Resultado cifrado (raw):', encrypted);
            console.log('Resultado cifrado (base64):', base64Encoded);
            
            return {
                encrypted: base64Encoded,
                verseUsed: verse,
                reference: reference
            };
        } catch (error) {
            throw new Error(`Error en cifrado: ${error.message}`);
        }
    }

    // Método CORRECTO de descifrado XOR
    async decrypt(encryptedText, reference) {
        try {
            const verse = await this.getVerse(reference);
            
            // Decodificar base64 primero
            const decoded = atob(encryptedText);
            const key = this.prepareKey(verse, decoded.length);
            
            console.log('DESCIFRANDO:');
            console.log('Texto cifrado (base64):', encryptedText);
            console.log('Texto cifrado (decoded):', decoded);
            console.log('Clave:', key);
            
            let decrypted = '';
            for (let i = 0; i < decoded.length; i++) {
                const encryptedChar = decoded.charCodeAt(i);
                const keyChar = key.charCodeAt(i % key.length);
                
                // Aplicar XOR nuevamente para descifrar
                const decryptedChar = encryptedChar ^ keyChar;
                decrypted += String.fromCharCode(decryptedChar);
                
                console.log(`Char ${i}: ${encryptedChar} XOR '${key[i % key.length]}' (${keyChar}) = ${decryptedChar} -> '${String.fromCharCode(decryptedChar)}'`);
            }
            
            console.log('Resultado descifrado:', decrypted);
            
            return {
                decrypted: decrypted,
                verseUsed: verse,
                reference: reference
            };
        } catch (error) {
            throw new Error(`Error en descifrado: ${error.message}`);
        }
    }

    prepareKey(verse, requiredLength) {
        // Limpiar el versículo pero mantenerlo legible
        let cleanVerse = verse.replace(/[^\w\sáéíóúñÁÉÍÓÚÑ]/g, '').toLowerCase();
        
        // Si no hay suficiente texto, repetir
        if (cleanVerse.length < requiredLength) {
            const repetitions = Math.ceil(requiredLength / cleanVerse.length);
            cleanVerse = cleanVerse.repeat(repetitions);
        }
        
        return cleanVerse.substring(0, requiredLength);
    }

    // Método ALTERNATIVO más simple para debugging
    async simpleEncrypt(message, reference) {
        const verse = await this.getVerse(reference);
        const key = this.prepareKey(verse, message.length);
        
        console.log('=== CIFRADO SIMPLE ===');
        console.log('Mensaje:', message);
        console.log('Clave:', key);
        
        let result = '';
        for (let i = 0; i < message.length; i++) {
            const charCode = message.charCodeAt(i) + key.charCodeAt(i % key.length);
            result += charCode.toString(16).padStart(4, '0') + ' ';
        }
        
        return {
            encrypted: result.trim(),
            verseUsed: verse,
            reference: reference
        };
    }

    async simpleDecrypt(encryptedText, reference) {
        const verse = await this.getVerse(reference);
        const key = this.prepareKey(verse, encryptedText.split(' ').length);
        
        console.log('=== DESCIFRADO SIMPLE ===');
        console.log('Texto cifrado:', encryptedText);
        console.log('Clave:', key);
        
        const hexCodes = encryptedText.split(' ');
        let result = '';
        
        for (let i = 0; i < hexCodes.length; i++) {
            const charCode = parseInt(hexCodes[i], 16) - key.charCodeAt(i % key.length);
            result += String.fromCharCode(charCode);
        }
        
        return {
            decrypted: result,
            verseUsed: verse,
            reference: reference
        };
    }
}