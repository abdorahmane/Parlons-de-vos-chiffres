/*
Nom : Voir - Contact
Écrit par : Thèmes Okler - (http://www.okler.net)
Version du thème : 12.1.0
*/

(($ => {
    /*
	Règles personnalisées
	*/

    // Pas d'espace blanc
    $.validator.addMethod("noSpace", (valeur, élément) => {
		si( $(élément).attr('requis') ) {
			valeur de retour.search(/^(?! *$)[^]+$/) == 0;
		}

		renvoie vrai ;
	}, 'Veuillez remplir ce champ vide.');

    /*
	Attribuer des règles personnalisées aux champs
	*/
    $.validator.addClassRules({
	    'form-control': {
	        noSpace : vrai
	    }
	});

    /*
	Formulaire de contact : basique
	*/
    $('.contact-form').each(function(){
		$(ceci).valider({
			errorPlacement (erreur, élément) {
				si(élément.attr('type') == 'radio' || élément.attr('type') == 'case à cocher') {
					erreur.appendTo(élément.closest('.form-group'));
				} else if( élément.is('select') && élément.closest('.custom-select-1') ) {
					erreur.appendTo(élément.closest('.form-group'));
				} autre {
					si( élément.le plus proche('.form-group').longueur ) {
						erreur.appendTo(élément.closest('.form-group'));
					} autre {
						erreur.insertAfter(élément);
					}
				}
			},
			submitHandler(formulaire) {

				const $form = $(formulaire), $messageSuccess = $form.find('.contact-form-success'), $messageError = $form.find('.contact-form-error'), $submitButton = $(this.submitButton), $errorMessage = $form.find('.mail-error-message'), submitButtonText = $submitButton.val();

				$submitButton.val( $submitButton.data('loading-text') ? $submitButton.data('loading-text') : 'Chargement...' ).attr('désactivé', vrai);

				// Données des champs
				const formData = $form.serializeArray(), data = {};

				$(formData).each((index, {nom, valeur}) => {
					si( données[nom] ) {
						données[nom] = données[nom] + ', ' + valeur ;						
					} autre {
						données[nom] = valeur;
					}
				});

				// Google Recaptcha v2
				si( données["g-recaptcha-response"] != indéfini ) {
					données["g-recaptcha-response"] = $form.find('#g-recaptcha-response').val();
				}

				// Soumission Ajax
				$.ajax({
					type : 'POST',
					url : $form.attr('action'),
					données
				}).always(({response, errorMessage, réponseText}, textStatus, jqXHR) => {

					$errorMessage.empty().hide();

					si (réponse == 'succès') {

						// Décommentez le code ci-dessous pour rediriger vers une page de remerciement
						// self.location = 'merci.html';

						$messageSuccess.removeClass('d-none');
						$messageError.addClass('d-none');

						// Réinitialiser le formulaire
						$form.find('.form-control')
							.val('')
							.se brouiller()
							.mère()
							.removeClass('a-réussi')
							.removeClass('présente un danger')
							.find('label.error')
							.retirer();

						si (($messageSuccess.offset().top - 80) < $(window).scrollTop()) {
							$('html, corps').animate({
								scrollTop : $messageSuccess.offset().top - 80
							}, 300);
						}

						$form.find('.form-control').removeClass('error');

						$submitButton.val(submitButtonText).attr('désactivé', false);
						
						retour;

					} else if (réponse == 'erreur' && typeof errorMessage !== 'undefined') {
						$errorMessage.html(errorMessage).show();
					} autre {
						$errorMessage.html(responseText).show();
					}

					$messageError.removeClass('d-none');
					$messageSuccess.addClass('d-none');

					si (($messageError.offset().top - 80) < $(window).scrollTop()) {
						$('html, corps').animate({
							scrollTop : $messageError.offset().top - 80
						}, 300);
					}

					$form.find('.has-success')
						.removeClass('a-réussi');
						
					$submitButton.val(submitButtonText).attr('désactivé', false);

				});
			}
		});
	});

    /*
	Formulaire de contact : Avancé
	*/
    $('#contactFormAdvanced').validate({
		onkeyup : faux,
		onclick : faux,
		onfocusout : faux,
		règles: {
			'captcha': {
				captcha : vrai
			},
			'cases à cocher[]': {
				obligatoire : vrai
			},
			'radios': {
				obligatoire : vrai
			}
		},
		errorPlacement (erreur, élément) {
			si(élément.attr('type') == 'radio' || élément.attr('type') == 'case à cocher') {
				erreur.appendTo(élément.closest('.form-group'));
			} else if( élément.is('select') && élément.closest('.custom-select-1') ) {
				erreur.appendTo(élément.closest('.form-group'));
			} autre {
				erreur.insertAfter(élément);
			}
		}
	});

    /*
	Formulaire de contact : reCaptcha v3
	*/
    $('.contact-form-recaptcha-v3').each(function(){
		$(ceci).valider({
			errorPlacement (erreur, élément) {
				si(élément.attr('type') == 'radio' || élément.attr('type') == 'case à cocher') {
					erreur.appendTo(élément.closest('.form-group'));
				} else if( élément.is('select') && élément.closest('.custom-select-1') ) {
					erreur.appendTo(élément.closest('.form-group'));
				} autre {
					erreur.insertAfter(élément);
				}
			},
			submitHandler(formulaire) {

				const $form = $(formulaire), $messageSuccess = $form.find('.contact-form-success'), $messageError = $form.find('.contact-form-error'), $submitButton = $(this.submitButton), $errorMessage = $form.find('.mail-error-message'), submitButtonText = $submitButton.val();

				$submitButton.val( $submitButton.data('loading-text') ? $submitButton.data('loading-text') : 'Chargement...' ).attr('désactivé', vrai);

				const recaptchaSrcURL = $('#google-recaptcha-v3').attr('src'), newURL = nouvelle URL(recaptchaSrcURL), site_key = newURL.searchParams.get("render");

				grecaptcha.execute(site_key, {action: 'contact_us'}).then(token => {

					// Données des champs
					const formData = $form.serializeArray(), data = {};

					$(formData).each((index, {nom, valeur}) => {
					    données[nom] = valeur;
					});

					// Jeton Recaptcha v3
					données["g-recaptcha-response"] = jeton;

					// Soumission Ajax
					$.ajax({
						type : 'POST',
						url : $form.attr('action'),
						données
					}).always(({response, errorMessage, réponseText}, textStatus, jqXHR) => {

						$errorMessage.empty().hide();

						si (réponse == 'succès') {

							// Décommentez le code ci-dessous pour rediriger vers une page de remerciement
							// self.location = 'merci.html';

							$messageSuccess.removeClass('d-none');
							$messageError.addClass('d-none');

							// Réinitialiser le formulaire
							$form.find('.form-control')
								.val('')
								.se brouiller()
								.mère()
								.removeClass('a-réussi')
								.removeClass('présente un danger')
								.find('label.error')
								.retirer();

							si (($messageSuccess.offset().top - 80) < $(window).scrollTop()) {
								$('html, corps').animate({
									scrollTop : $messageSuccess.offset().top - 80
								}, 300);
							}

							$form.find('.form-control').removeClass('error');

							$submitButton.val(submitButtonText).attr('désactivé', false);
							
							retour;

						} else if (réponse == 'erreur' && typeof errorMessage !== 'undefined') {
							$errorMessage.html(errorMessage).show();
						} autre {
							$errorMessage.html(responseText).show();
						}

						$messageError.removeClass('d-none');
						$messageSuccess.addClass('d-none');

						si (($messageError.offset().top - 80) < $(window).scrollTop()) {
							$('html, corps').animate({
								scrollTop : $messageError.offset().top - 80
							}, 300);
						}

						$form.find('.has-success')
							.removeClass('a-réussi');
							
						$submitButton.val(submitButtonText).attr('désactivé', false);

					});

				});
			}
		});
	});
})).apply(ceci, [jQuery]);
