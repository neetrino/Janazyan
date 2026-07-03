'use client';

import { Input } from '@shop/ui';
import Image from 'next/image';
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  CONTACT_FORM_CARD_CLASS,
  CONTACT_FORM_INPUT_CLASS,
  CONTACT_FORM_LABEL_CLASS,
  CONTACT_FORM_MESSAGE_GROUP_CLASS,
  CONTACT_FORM_ROW_CLASS,
  CONTACT_FORM_STACK_CLASS,
  CONTACT_FORM_SUBJECT_GROUP_CLASS,
  CONTACT_FORM_TEXTAREA_CLASS,
  CONTACT_SEND_ICON_SRC,
  CONTACT_SUBMIT_BUTTON_CLASS,
} from '../contact-page.constants';
import { useTranslation } from '../../../lib/i18n-client';
import { apiClient } from '../../../lib/api-client';

type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const INITIAL_FORM_STATE: ContactFormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export function ContactFormSection() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ContactFormState>(INITIAL_FORM_STATE);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await apiClient.post(
        '/api/v1/contact',
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        { skipAuth: true },
      );

      setFormData(INITIAL_FORM_STATE);
      alert(t('contact.form.submitSuccess'));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : t('contact.form.submitError');
      console.error('Error submitting contact form:', error);
      alert(t('contact.form.submitError') || errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className={CONTACT_FORM_CARD_CLASS}>
      <form onSubmit={handleSubmit} className={CONTACT_FORM_STACK_CLASS}>
        <div className={CONTACT_FORM_ROW_CLASS}>
          <div>
            <label htmlFor="contact-name" className={CONTACT_FORM_LABEL_CLASS}>
              {t('contact.form.name')}
            </label>
            <Input
              id="contact-name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className={CONTACT_FORM_INPUT_CLASS}
              placeholder={t('contact.form.namePlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="contact-email" className={CONTACT_FORM_LABEL_CLASS}>
              {t('contact.form.email')}
            </label>
            <Input
              id="contact-email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={CONTACT_FORM_INPUT_CLASS}
              placeholder={t('contact.form.emailPlaceholder')}
            />
          </div>
        </div>

        <div className={CONTACT_FORM_SUBJECT_GROUP_CLASS}>
          <label htmlFor="contact-subject" className={CONTACT_FORM_LABEL_CLASS}>
            {t('contact.form.subject')}
          </label>
          <Input
            id="contact-subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            className={CONTACT_FORM_INPUT_CLASS}
            placeholder={t('contact.form.subjectPlaceholder')}
          />
        </div>

        <div className={CONTACT_FORM_MESSAGE_GROUP_CLASS}>
          <label htmlFor="contact-message" className={CONTACT_FORM_LABEL_CLASS}>
            {t('contact.form.message')}
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            required
            value={formData.message}
            onChange={handleChange}
            className={CONTACT_FORM_TEXTAREA_CLASS}
            placeholder={t('contact.form.messagePlaceholder')}
          />
        </div>

        <button type="submit" className={CONTACT_SUBMIT_BUTTON_CLASS} disabled={submitting}>
          <Image src={CONTACT_SEND_ICON_SRC} alt="" aria-hidden width={16} height={16} />
          {submitting ? t('contact.form.submitting') : t('contact.form.submit')}
        </button>
      </form>
    </div>
  );
}
