import crypto from 'crypto';

// 2. Password Hashing with Salt
export async function hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const [salt, key] = storedHash.split(':');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return key === hash;
}

// 3. End-to-End Encryption for Sensitive Data (AES-256)
const ENCRYPTION_KEY = crypto.randomBytes(32); // 32 bytes for AES-256
const IV_LENGTH = 16;

export function encryptData(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decryptData(text: string): string {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// 4. Secure Session Management settings config
export const sessionConfig = {
    cookieOptions: {
        secure: true,
        httpOnly: true,
        sameSite: 'strict' as const,
        maxAge: 60 * 60 * 24 // 24 hours
    }
};

// 6. API Rate Limiting config
export const rateLimitConfig = {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100
};

// 7. Login Attempt Monitoring
const loginAttempts = new Map<string, { count: number; lockUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 mins

export function checkLoginAttempts(ipOrUsername: string): { locked: boolean; timeRemaining?: number } {
    const record = loginAttempts.get(ipOrUsername);
    if (!record) return { locked: false };

    if (record.lockUntil > Date.now()) {
        return { locked: true, timeRemaining: record.lockUntil - Date.now() };
    }
    
    if (record.lockUntil !== 0 && record.lockUntil < Date.now()) {
        loginAttempts.delete(ipOrUsername);
    }
    return { locked: false };
}

export function recordFailedLogin(ipOrUsername: string) {
    const record = loginAttempts.get(ipOrUsername) || { count: 0, lockUntil: 0 };
    record.count += 1;
    if (record.count >= MAX_ATTEMPTS) {
        record.lockUntil = Date.now() + LOCK_TIME_MS;
    }
    loginAttempts.set(ipOrUsername, record);
}

// 8. Secure File Upload validation
export function validateFileUpload(file: File) {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
        throw new Error("Invalid file type. Only JPG, PNG, and PDF allowed.");
    }
    if (file.size > maxSize) {
        throw new Error("File too large. Maximum size is 5MB.");
    }
    return true;
}

// 10. Audit Logging System
export interface AuditLogEntry {
    id: string;
    timestamp: Date;
    action: string;
    user: string;
    details: string;
}

const auditLogs: AuditLogEntry[] = [];

export function addAuditLog(action: string, user: string, details: string) {
    const log = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        action,
        user,
        details
    };
    auditLogs.push(log);
}
