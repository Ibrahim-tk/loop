'use client';

import { useState } from 'react';
import { buildLeadNotificationHtml } from '@/lib/email/lead-notification';
import { INQUIRY_OPTIONS } from '@/lib/constants/inquiry-options';

const SAMPLE_DATA = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    helpType: 'Property Management',
    message:
        'Hi, I own a 3-bedroom property in downtown Austin and I\'m looking for a reliable management company to handle tenant screening, rent collection, and maintenance coordination.\n\nCould you provide more details about your management packages and pricing?',
};

export default function EmailPreviewPage() {
    const [helpType, setHelpType] = useState(SAMPLE_DATA.helpType);

    const html = buildLeadNotificationHtml({
        ...SAMPLE_DATA,
        helpType,
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Email Preview</h1>
                <p className="text-white/50 text-sm mt-1">
                    Preview how the lead notification email looks with sample data.
                </p>
            </div>

            <div className="flex items-center gap-3">
                <label className="text-white/60 text-sm">Inquiry Type:</label>
                <select
                    value={helpType}
                    onChange={(e) => setHelpType(e.target.value)}
                    className="glass-input"
                >
                    {INQUIRY_OPTIONS.map((opt) => (
                        <option key={opt.label} value={opt.label}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="glass-card overflow-hidden">
                <iframe
                    srcDoc={html}
                    title="Email Preview"
                    className="w-full bg-white rounded-lg"
                    style={{ height: '800px', border: 'none' }}
                />
            </div>
        </div>
    );
}
