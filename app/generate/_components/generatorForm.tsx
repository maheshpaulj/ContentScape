"use client";

import { useForm, Controller } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FormData, platforms, tones, audienceTypes, contentLengths } from "./types";

type GeneratorFormProps = {
  onSubmit: (data: FormData) => void;
  isGenerating: boolean;
};

export function GeneratorForm({ onSubmit, isGenerating }: GeneratorFormProps) {
  const { register, handleSubmit, watch, control, reset } = useForm<FormData>({
    defaultValues: {
      prompt: "",
      platforms: ["twitter"],
      tone: "Professional",
      audience: "General",
      useAdvancedSettings: false,
      includeHashtags: true,
      includeEmojis: true,
      contentLength: "medium",
    },
  });

  const useAdvancedSettings = watch("useAdvancedSettings");

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold">Enter Prompt</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            {/* <Label htmlFor="prompt" className="text-base font-medium">Prompt</Label> */}
            <Textarea
              id="prompt"
              placeholder="Enter your content idea..."
              className="min-h-24 sm:min-h-32 w-full"
              {...register("prompt")}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium">Platforms</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {platforms.map((platform) => (
                <div key={platform.id} className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name="platforms"
                    render={({ field }) => (
                      <Checkbox
                        id={platform.id}
                        checked={field.value?.includes(platform.id)}
                        onCheckedChange={(checked) => {
                          const updatedValue = checked
                            ? [...field.value, platform.id]
                            : field.value.filter((value) => value !== platform.id);
                          field.onChange(updatedValue);
                        }}
                      />
                    )}
                  />
                  <Label htmlFor={platform.id} className="cursor-pointer text-sm sm:text-base">
                    {platform.icon} {platform.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              control={control}
              name="useAdvancedSettings"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="advanced-settings"
                />
              )}
            />
            <Label htmlFor="advanced-settings" className="text-sm sm:text-base">Advanced Settings</Label>
          </div>

          {useAdvancedSettings && (
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="space-y-2">
                <Label className="text-base font-medium">Tone</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {tones.map((tone) => (
                    <div key={tone} className="flex items-center space-x-2">
                      <Controller
                        control={control}
                        name="tone"
                        render={({ field }) => (
                          <input
                            type="radio"
                            id={`tone-${tone}`}
                            value={tone}
                            checked={field.value === tone}
                            onChange={() => field.onChange(tone)}
                            className="form-radio"
                          />
                        )}
                      />
                      <Label htmlFor={`tone-${tone}`} className="text-sm sm:text-base">{tone}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">Audience</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {audienceTypes.map((audience) => (
                    <div key={audience} className="flex items-center space-x-2">
                      <Controller
                        control={control}
                        name="audience"
                        render={({ field }) => (
                          <input
                            type="radio"
                            id={`audience-${audience}`}
                            value={audience}
                            checked={field.value === audience}
                            onChange={() => field.onChange(audience)}
                            className="form-radio"
                          />
                        )}
                      />
                      <Label htmlFor={`audience-${audience}`} className="text-sm sm:text-base">{audience}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">Content Length</Label>
                <div className="flex flex-wrap gap-4">
                  {contentLengths.map((length) => (
                    <div key={length.id} className="flex items-center space-x-2">
                      <Controller
                        control={control}
                        name="contentLength"
                        render={({ field }) => (
                          <input
                            type="radio"
                            id={`length-${length.id}`}
                            value={length.id}
                            checked={field.value === length.id}
                            onChange={() => field.onChange(length.id)}
                            className="form-radio"
                          />
                        )}
                      />
                      <Label htmlFor={`length-${length.id}`} className="text-sm sm:text-base">{length.name}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name="includeHashtags"
                    render={({ field }) => (
                      <Checkbox
                        id="include-hashtags"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor="include-hashtags" className="text-sm sm:text-base">Hashtags</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name="includeEmojis"
                    render={({ field }) => (
                      <Checkbox
                        id="include-emojis"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor="include-emojis" className="text-sm sm:text-base">Emojis</Label>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Button
              type="submit"
              disabled={isGenerating}
              className="w-full sm:w-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              className="w-full sm:w-auto"
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}