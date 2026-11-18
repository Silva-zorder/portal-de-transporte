import { Button } from "@hubble-ds/components/ui/button";
import { PlusCircleIcon } from "@phosphor-icons/react";
import type { AnyResourceDefinition } from "@/lib/resource/types";
import { PageHeader } from "./page-header";
import { ResourcePageActions, useResourceFormController } from "./resource-form";
import { ResourceList } from "./resource-list";

function ResourceListPage({
  definition,
}: Readonly<{ definition: AnyResourceDefinition }>) {
  const controller = useResourceFormController();
  const CreateIcon = definition.createIcon ?? PlusCircleIcon;

  return (
    <>
      <PageHeader
        title={definition.title}
        actions={
          <>
            <ResourcePageActions definition={definition} controller={controller} />
            {definition.createLabel && (
              <Button
                onClick={controller.openCreate}
                data-testid={`${definition.key}-create-button`}
              >
                <CreateIcon />
                {definition.createLabel}
              </Button>
            )}
          </>
        }
      />
      <ResourceList definition={definition} controller={controller} />
    </>
  );
}

export { ResourceListPage };
