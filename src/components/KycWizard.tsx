import { useState, useRef } from 'react';
import { Upload, Camera, Check, ChevronRight, X, FileImage, User } from 'lucide-react';

interface KycWizardProps {
    onSubmit: () => void;
}

type StepId = 'personal' | 'document' | 'selfie' | 'review';

interface FormData {
    firstName: string;
    lastName: string;
    dob: string;
    nationality: string;
    docType: 'passport' | 'national_id' | 'drivers_license';
    docFront: File | null;
    docBack: File | null;
    selfie: File | null;
}

const STEPS: { id: StepId; label: string; desc: string }[] = [
    { id: 'personal', label: 'Personal Info', desc: 'Full name, DOB, nationality' },
    { id: 'document', label: 'Identity Document', desc: 'Upload front & back of your ID' },
    { id: 'selfie', label: 'Selfie with ID', desc: 'Photo of you holding your document' },
    { id: 'review', label: 'Review & Submit', desc: 'Confirm your details' },
];

function FileUploadZone({ label, hint, file, onChange, accept = 'image/*,.pdf' }: {
    label: string; hint: string; file: File | null; onChange: (f: File) => void; accept?: string;
}) {
    const ref = useRef<HTMLInputElement>(null);
    const [drag, setDrag] = useState(false);
    const preview = file && file.type.startsWith('image/') ? URL.createObjectURL(file) : null;

    return (
        <div>
            <p className="text-foreground text-sm font-medium mb-2">{label}</p>
            <div
                onClick={() => ref.current?.click()}
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) onChange(f); }}
                className={`relative cursor-pointer border-2 border-dashed rounded-xl transition-all ${drag ? 'border-primary bg-primary/5' : file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-border/60 hover:border-primary/40 bg-secondary/20'}`}
                style={{ minHeight: 120 }}
            >
                <input ref={ref} type="file" accept={accept} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) onChange(f); }} />
                {preview ? (
                    <div className="relative">
                        <img src={preview} alt="preview" className="w-full h-36 object-cover rounded-xl" />
                        <div className="absolute top-2 right-2 bg-emerald-500 rounded-full p-1">
                            <Check className="w-3 h-3 text-white" />
                        </div>
                    </div>
                ) : file ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-2">
                        <FileImage className="w-8 h-8 text-emerald-400" />
                        <p className="text-emerald-400 text-xs font-medium">{file.name}</p>
                        <p className="text-muted-foreground text-xs">Click to replace</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 gap-2">
                        <Upload className="w-7 h-7 text-muted-foreground/50" />
                        <p className="text-muted-foreground text-sm">{hint}</p>
                        <p className="text-muted-foreground/60 text-xs">PNG, JPG, PDF · Max 10MB</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function KycWizard({ onSubmit }: KycWizardProps) {
    const [step, setStep] = useState<StepId>('personal');
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState<FormData>({
        firstName: '', lastName: '', dob: '', nationality: '',
        docType: 'passport', docFront: null, docBack: null, selfie: null,
    });

    const stepIdx = STEPS.findIndex(s => s.id === step);

    const canProceed = () => {
        if (step === 'personal') return form.firstName && form.lastName && form.dob && form.nationality;
        if (step === 'document') return form.docFront && (form.docType === 'passport' ? true : !!form.docBack);
        if (step === 'selfie') return !!form.selfie;
        return true;
    };

    const next = async () => {
        const nextStep = STEPS[stepIdx + 1];
        if (!nextStep) {
            setSubmitting(true);
            await new Promise(r => setTimeout(r, 1500));
            setSubmitting(false);
            onSubmit();
        } else {
            setStep(nextStep.id);
        }
    };

    return (
        <div className="space-y-4">
            {/* Step indicator */}
            <div className="flex items-center gap-2">
                {STEPS.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-2 flex-1">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${i < stepIdx ? 'bg-emerald-500 text-white' :
                                i === stepIdx ? 'bg-primary text-white ring-4 ring-primary/20' :
                                    'bg-secondary text-muted-foreground'}`}>
                            {i < stepIdx ? <Check className="w-3.5 h-3.5" /> : i + 1}
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={`flex-1 h-0.5 rounded-full ${i < stepIdx ? 'bg-emerald-500' : 'bg-border/40'}`} />
                        )}
                    </div>
                ))}
            </div>
            <div>
                <p className="text-foreground text-sm font-semibold">{STEPS[stepIdx].label}</p>
                <p className="text-muted-foreground text-xs">{STEPS[stepIdx].desc}</p>
            </div>

            {/* ─── Step: Personal Info ─── */}
            {step === 'personal' && (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'First Name', key: 'firstName', placeholder: 'John' },
                            { label: 'Last Name', key: 'lastName', placeholder: 'Doe' },
                        ].map(f => (
                            <div key={f.key}>
                                <label className="block text-xs text-muted-foreground mb-1">{f.label}</label>
                                <input value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                    placeholder={f.placeholder}
                                    className="w-full bg-background/80 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-all" />
                            </div>
                        ))}
                    </div>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Date of Birth</label>
                        <input type="date" value={form.dob} onChange={e => setForm(p => ({ ...p, dob: e.target.value }))}
                            className="w-full bg-background/80 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Nationality</label>
                        <input value={form.nationality} onChange={e => setForm(p => ({ ...p, nationality: e.target.value }))}
                            placeholder="e.g. American"
                            className="w-full bg-background/80 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-all" />
                    </div>
                </div>
            )}

            {/* ─── Step: Document Upload ─── */}
            {step === 'document' && (
                <div className="space-y-4">
                    <div>
                        <p className="text-xs text-muted-foreground mb-2">Document Type</p>
                        <div className="grid grid-cols-3 gap-2">
                            {[['passport', 'Passport'], ['national_id', 'National ID'], ['drivers_license', "Driver's License"]].map(([val, lbl]) => (
                                <button key={val} onClick={() => setForm(p => ({ ...p, docType: val as any }))}
                                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${form.docType === val ? 'border-primary/60 bg-primary/10 text-primary' : 'border-border/60 text-muted-foreground hover:text-foreground'}`}>
                                    {lbl}
                                </button>
                            ))}
                        </div>
                    </div>
                    <FileUploadZone
                        label={form.docType === 'passport' ? 'Passport Photo Page' : 'Front of Document'}
                        hint="Drag & drop or click to upload"
                        file={form.docFront}
                        onChange={f => setForm(p => ({ ...p, docFront: f }))}
                    />
                    {form.docType !== 'passport' && (
                        <FileUploadZone
                            label="Back of Document"
                            hint="Upload the reverse side"
                            file={form.docBack}
                            onChange={f => setForm(p => ({ ...p, docBack: f }))}
                        />
                    )}
                    <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
                        <span className="text-amber-400 text-xs">⚠️</span>
                        <p className="text-amber-400/90 text-xs">Ensure the document is clearly readable, not expired, and all four corners are visible. Blurry images will be rejected.</p>
                    </div>
                </div>
            )}

            {/* ─── Step: Selfie with ID ─── */}
            {step === 'selfie' && (
                <div className="space-y-4">
                    <div className="bg-secondary/30 border border-border/50 rounded-xl p-4 flex gap-3">
                        <Camera className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-foreground text-sm font-medium">Selfie Requirements</p>
                            <ul className="text-muted-foreground text-xs space-y-1 list-disc list-inside">
                                <li>Hold your <strong className="text-foreground">identity document</strong> next to your face</li>
                                <li>Both your face and document must be clearly visible</li>
                                <li>Take the photo in good lighting</li>
                                <li>Do not wear sunglasses, hats, or masks</li>
                                <li>Look directly at the camera</li>
                            </ul>
                        </div>
                    </div>
                    <div className="bg-secondary/20 border-2 border-dashed border-primary/30 rounded-2xl p-8 flex flex-col items-center gap-3">
                        <div className="relative">
                            <User className="w-12 h-12 text-muted-foreground/30" />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary/20 border border-primary/40 rounded-full flex items-center justify-center">
                                <Camera className="w-2.5 h-2.5 text-primary" />
                            </div>
                        </div>
                        <p className="text-muted-foreground text-xs text-center">
                            Example: A clear photo of you<br />holding your ID next to your face
                        </p>
                    </div>
                    <FileUploadZone
                        label="Selfie with ID Photo"
                        hint="Upload a photo of you holding your document"
                        file={form.selfie}
                        onChange={f => setForm(p => ({ ...p, selfie: f }))}
                        accept="image/*"
                    />
                </div>
            )}

            {/* ─── Step: Review ─── */}
            {step === 'review' && (
                <div className="space-y-3">
                    <div className="bg-secondary/30 border border-border/50 rounded-xl divide-y divide-border/30">
                        {[
                            { label: 'Full Name', value: `${form.firstName} ${form.lastName}` },
                            { label: 'Date of Birth', value: form.dob },
                            { label: 'Nationality', value: form.nationality },
                            { label: 'Document', value: form.docType.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) },
                            { label: 'Doc Front', value: form.docFront?.name ?? '—' },
                            { label: 'Doc Back', value: form.docBack?.name ?? (form.docType === 'passport' ? 'N/A' : '—') },
                            { label: 'Selfie', value: form.selfie?.name ?? '—' },
                        ].map(r => (
                            <div key={r.label} className="flex justify-between px-4 py-2.5">
                                <span className="text-muted-foreground text-xs">{r.label}</span>
                                <span className="text-foreground text-xs font-medium max-w-[180px] truncate text-right">{r.value}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-muted-foreground text-xs px-1">
                        By submitting, you confirm all information is accurate. False documentation is a criminal offence. We'll verify within 24 hours via email.
                    </p>
                </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 pt-2">
                {stepIdx > 0 && (
                    <button onClick={() => setStep(STEPS[stepIdx - 1].id)}
                        className="px-5 py-2.5 rounded-xl text-sm bg-secondary text-muted-foreground hover:text-foreground transition-all">
                        Back
                    </button>
                )}
                <button onClick={next} disabled={!canProceed() || submitting}
                    className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2">
                    {submitting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : step === 'review' ? (
                        <><Check className="w-4 h-4" /> Submit for Review</>
                    ) : (
                        <>Continue <ChevronRight className="w-4 h-4" /></>
                    )}
                </button>
            </div>
        </div>
    );
}
