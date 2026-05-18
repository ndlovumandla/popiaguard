export interface ApiResponse<T = unknown> { success: boolean; data?: T; message?: string; errors?: unknown; }
export interface User { id: string; orgId: string; email: string; firstName: string; lastName: string; role: 'owner'|'admin'|'member'|'viewer'; emailVerified: boolean; avatarUrl?: string|null; createdAt: string; }
export interface Organisation { id: string; name: string; registrationNumber?: string|null; industry?: string|null; size?: string|null; plan: 'free'|'starter'|'professional'|'enterprise'; onboardingComplete: boolean; complianceScore: number; }
export interface ScoreComponent { label: string; earned: number; max: number; met: boolean; description: string; }
