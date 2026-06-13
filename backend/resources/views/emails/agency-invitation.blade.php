@component('mail::message')
# Bonjour {{ $name }},

Merci de votre intérêt pour **Habyora** – la plateforme n°1 de l'immobilier en Côte d'Ivoire.

Vous souhaitez publier vos biens et toucher des milliers d'acheteurs et locataires ?  
Créez votre compte agence gratuitement dès maintenant.

@component('mail::button', ['url' => $registerUrl, 'color' => 'orange'])
Créer mon compte agence
@endcomponent

Ce lien est valable pendant 7 jours.

À très bientôt sur Habyora !  
**L'équipe Habyora**

---

*Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.*
@endcomponent
