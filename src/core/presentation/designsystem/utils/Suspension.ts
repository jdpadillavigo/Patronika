function parseLocalDate(dateString: string): Date {
    const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
    return new Date(year, month - 1, day);
}

export function formatSuspensionDate(dateString?: string | null): string {
    if (!dateString) return '';
    return parseLocalDate(dateString).toLocaleDateString('es-PE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export function getSuspensionDaysRemaining(dateString?: string | null): number {
    if (!dateString) return 0;
    const end = parseLocalDate(dateString);
    end.setHours(23, 59, 59, 999);
    const difference = Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return Math.max(difference, 0);
}
