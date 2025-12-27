"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ensureTranslations(pkg) {
    if (pkg.translations?.en) {
        console.log("Translations exist, returning as is");
        return {
            ...pkg,
            destinationIds: pkg.destinationIds || [],
        };
    }
    console.log("Translations do NOT exist, defaulting/migrating");
    if (pkg.destination) {
        return {
            ...pkg,
            translations: {
                en: {
                    title: pkg.destination.title,
                    description: pkg.destination.quickLook || '',
                    quickLook: pkg.destination.quickLook || '',
                },
            },
            dates: pkg.destination.dates || pkg.dates,
            price: pkg.destination.price || pkg.price,
            image: pkg.destination.image || pkg.image,
            destinationIds: pkg.destinationIds || [],
        };
    }
    return {
        ...pkg,
        translations: pkg.translations || {
            en: {
                title: pkg.name || 'Untitled',
                description: '',
                quickLook: '',
            },
        },
        destinationIds: pkg.destinationIds || [],
    };
}
const inputPackage = {
    id: 'test-pkg',
    name: 'Test Package',
    translations: {
        en: { title: 'English Title', description: 'Desc', quickLook: 'Quick' },
        de: { title: 'German Title', description: 'Desc DE', quickLook: 'Quick DE' }
    }
};
const result1 = ensureTranslations(inputPackage);
console.log('Result 1 (Should have DE):', result1.translations);
const legacyPackage = {
    id: 'legacy-pkg',
    name: 'Legacy Package'
};
const legacyUpdate = {
    ...legacyPackage,
    translations: {
        en: { title: 'Legacy Package', description: '', quickLook: '' },
        de: { title: 'German Legacy', description: '', quickLook: '' }
    }
};
const result2 = ensureTranslations(legacyUpdate);
console.log('Result 2 (Should have DE):', result2.translations);
//# sourceMappingURL=test-translations.js.map