"use client";
import { useState } from "react";
import { StarRating } from "@/components/ui/StarRating";
import { Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface ReviewFormProps {
  initialRating?: number;
  initialContent?: string;
  onSubmit: (data: { rating: number; content?: string }) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function ReviewForm({
  initialRating = 0,
  initialContent = "",
  onSubmit,
  onCancel,
  submitLabel = "Publicar",
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialRating);
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError("Selecione uma nota."); return; }
    setError("");
    setLoading(true);
    try {
      await onSubmit({ rating, content: content.trim() || undefined });
    } catch {
      setError("Não foi possível salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm text-foreground-dim mb-2">Sua nota</p>
        <StarRating value={rating} onChange={setRating} size="lg" />
        {error && <p className="text-xs text-danger mt-1">{error}</p>}
      </div>

      <Textarea
        label="Comentário (opcional)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="O que achou do álbum?"
        rows={4}
        maxLength={5000}
      />

      <div className="flex items-center gap-2 justify-end">
        {onCancel && (
          <Button variant="ghost" size="sm" type="button" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" size="sm" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
