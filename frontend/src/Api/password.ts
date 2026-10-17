export const PASSWORD_LEVELS = ["", "bad", "normal", "perfect"];

export type PasswordCheck = {
    hints: string[];
    level: number;
};

export function checkPassword(password: string): PasswordCheck {
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);
    const hasInvalidChars = /[^\x00-\x7F]/.test(password);
    const hasSpaces = /\s/.test(password);
    const length = password.length;

    const hints = [
        length < 7 && "Добавьте больше символов",
        hasSpaces && "Уберите пробелы",
        hasInvalidChars && "Используйте только латиницу",
        !hasNumbers && "Добавьте цифры",
        !hasLetters && "Добавьте латиницу",
        !hasSpecial && "Добавьте специальные символы",
    ].filter((hint): hint is string => Boolean(hint));

    const percentage = (1 - hints.length / 6) * 100;

    const level = hasInvalidChars
        ? 1
        : percentage < 50
          ? 1
          : percentage < 100
            ? 2
            : 3;

    return { hints, level };
}