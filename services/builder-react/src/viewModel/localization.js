import React, { useEffect, useState } from 'react';
import { useDemoConfigs } from './useDemoConfigs';

export function useTranslations(translationKey) {
	const { locale } = useDemoConfigs();
	const [translations, setTranslations] = useState(null);

	useEffect(() => {
		async function fetchTranslations() {
			const { results } = await (
				await fetch(
					'https://cdn.builder.io/api/v3/content/storefront-translations?apiKey=fc4960519e0647dab50bf0ba5f17aae9',
				)
			).json();
			const { data: translations } = results[0] ?? {};
			try {
				setTranslations(translations[translationKey][locale ?? 'Default']);
			} catch (err) {
				setTranslations(`${translationKey} not found for ${locale}`)
			}
		}
		if (!translations)
			fetchTranslations();
	}, []);

	return translations;
}
