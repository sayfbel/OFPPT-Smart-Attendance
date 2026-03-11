import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    fr: {
        translation: {
            "nav": {
                "dashboard": "Tableau de bord",
                "members": "Membres",
                "groups": "Groupes",
                "timetable": "Emploi du temps",
                "reports": "Rapports",
                "my_groups": "Mes Groupes",
                "logout": "Déconnexion",
                "portal": "ISTA_PORTAL",
                "digital_campus": "CAMPUS NUMÉRIQUE"
            },
            "header": {
                "admin_access": "ADMIN ACCÈS",
                "formateur_access": "FORMATEUR ACCÈS",
                "theme_toggle": "Changer le thème",
                "settings": "Paramètres",
                "notif_panel": "Panneau de notifications"
            }
        }
    },
    ar: {
        translation: {
            "nav": {
                "dashboard": "لوحة التحكم",
                "members": "الأعضاء",
                "groups": "المجموعات",
                "timetable": "الجدول الزمني",
                "reports": "التقارير",
                "my_groups": "مجموعاتي",
                "logout": "تسجيل الخروج",
                "portal": "بوابة ISTA",
                "digital_campus": "الحرم الجامعي الرقمي"
            },
            "header": {
                "admin_access": "وصول المسؤول",
                "formateur_access": "وصول المكون",
                "theme_toggle": "تغيير المظهر",
                "settings": "الإعدادات",
                "notif_panel": "لوحة التنبيهات"
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'fr',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
