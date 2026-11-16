import { Button } from "@hubble-ds/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@hubble-ds/components/ui/dialog";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadDropzoneDescription,
  FileUploadDropzoneMedia,
  FileUploadDropzoneTitle,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@hubble-ds/components/ui/file-upload";
import { toast } from "@hubble-ds/components/ui/toast";
import { XIcon } from "@phosphor-icons/react";
import { useState } from "react";
import type { AnyResourceDefinition } from "@/lib/resource/types";

const MAX_IMPORT_SIZE_BYTES = 10 * 1024 * 1024;

function ResourceImportDialog({
  definition,
  open,
  onOpenChange,
}: Readonly<{
  definition: AnyResourceDefinition;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>) {
  const context = `${definition.key}-import`;
  const [files, setFiles] = useState<File[]>([]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setFiles([]);
    onOpenChange(nextOpen);
  };

  const handleImport = () => {
    toast.success(
      `Arquivo ${files[0]?.name} recebido. A importação será processada em segundo plano.`,
    );
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent data-testid={`${context}-dialog`}>
        <DialogHeader>
          <DialogTitle>Importar {definition.title.toLowerCase()}</DialogTitle>
          <DialogCloseButton data-testid={`${context}-close-button`} />
        </DialogHeader>
        <FileUpload
          value={files}
          onValueChange={setFiles}
          maxFiles={1}
          maxSize={MAX_IMPORT_SIZE_BYTES}
          accept=".csv,text/csv"
          label={`Arquivo de ${definition.title.toLowerCase()}`}
          className="py-md"
        >
          <FileUploadDropzone data-testid={`${context}-dropzone`}>
            <FileUploadDropzoneMedia />
            <FileUploadDropzoneTitle>
              Arraste o arquivo CSV até aqui
            </FileUploadDropzoneTitle>
            <FileUploadDropzoneDescription>
              Um arquivo .csv de até 10 MB, no mesmo layout do arquivo exportado.
            </FileUploadDropzoneDescription>
            <FileUploadTrigger asChild>
              <Button
                variant="outline"
                size="small"
                data-testid={`${context}-select-file-button`}
              >
                Selecionar arquivo
              </Button>
            </FileUploadTrigger>
          </FileUploadDropzone>
          <FileUploadList>
            {files.map((file) => (
              <FileUploadItem key={`${file.name}-${file.size}`} value={file}>
                <FileUploadItemPreview />
                <FileUploadItemMetadata />
                <FileUploadItemDelete aria-label="Remover arquivo">
                  <XIcon />
                </FileUploadItemDelete>
              </FileUploadItem>
            ))}
          </FileUploadList>
        </FileUpload>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" data-testid={`${context}-cancel-button`}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            disabled={files.length === 0}
            onClick={handleImport}
            data-testid={`${context}-submit-button`}
          >
            Importar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ResourceImportDialog };
