// File: src/components/GradingForm.js
'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function GradingForm({ submission }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [grade, setGrade] = useState(submission.grade || '');
  const [feedback, setFeedback] = useState(submission.teacher_feedback || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('Menyimpan nilai...');

    const { error } = await supabase
      .from('submissions')
      .update({
        grade: grade,
        teacher_feedback: feedback,
      })
      .eq('id', submission.id);

    if (error) {
      setMessage('Gagal menyimpan nilai: ' + error.message);
    } else {
      setMessage('Nilai berhasil disimpan!');
      router.refresh();
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleGradeSubmit} className="mt-4 p-4 border-t space-y-3">
      <h4 className="text-md font-semibold">Beri Penilaian</h4>
      <div>
        <label htmlFor={`grade-${submission.id}`} className="block text-sm font-medium">Nilai</label>
        <input
          id={`grade-${submission.id}`}
          type="text"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded-md"
          placeholder="Contoh: 95 atau A+"
        />
      </div>
      <div>
        <label htmlFor={`feedback-${submission.id}`} className="block text-sm font-medium">Feedback / Catatan</label>
        <textarea
          id={`feedback-${submission.id}`}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows="3"
          className="w-full mt-1 px-3 py-2 border rounded-md"
          placeholder="Tulis feedback untuk siswa..."
        ></textarea>
      </div>
      <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:bg-gray-400">
        {isSubmitting ? 'Menyimpan...' : 'Simpan Nilai'}
      </button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  );
}