import React from 'react';
import {useSiteConfig} from '../data/site';
import {baseUrl,languageBase} from './links';
export default function CreativeLab({initialLanguage = 'en'}: {initialLanguage?: 'en' | 'es'}){const {config,lang}=useSiteConfig(initialLanguage);return <div className="max-w-7xl mx-auto px-5 pt-36"><a className="text-action text-sm" href={languageBase(lang)}>← {config.game.back}</a><h1 className="section-heading mt-8">{config.game.title}</h1><p className="text-gray-400 leading-relaxed mt-5 max-w-2xl">{config.game.description}</p></div>}
