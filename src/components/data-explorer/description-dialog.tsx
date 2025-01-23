import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type DescriptionDialogProps = {
  title: string
  description: string
}

export const DescriptionDialog = ({
  title,
  description,
}: DescriptionDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger className="inline-flex font-semibold">
        Read more
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
