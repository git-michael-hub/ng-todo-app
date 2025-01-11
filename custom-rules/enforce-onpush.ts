import { TSESLint, TSESTree } from "@typescript-eslint/utils";

const enforceOnPush: TSESLint.RuleModule<"missingOnPush", []> = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Ensure ChangeDetectionStrategy.OnPush is used in Angular components",
    },
    messages: {
      missingOnPush: "Components should use ChangeDetectionStrategy.OnPush.",
    },
    schema: [], // No options
    fixable: "code",
  },
  create(context) {
    return {
      ClassDeclaration(node: TSESTree.ClassDeclaration) {
        // Check for a `Component` decorator
        const decorator = node.decorators?.find((d) => {
          const expression = d.expression as TSESTree.CallExpression;
          return (
            expression.callee.type === "Identifier" &&
            expression.callee.name === "Component"
          );
        });

        if (decorator) {
          const args = (decorator.expression as TSESTree.CallExpression)
            .arguments[0] as TSESTree.ObjectExpression;

          if (args && args.type === "ObjectExpression") {
            // Look for `changeDetection: ChangeDetectionStrategy.OnPush`
            const hasOnPush = args.properties.some((prop) => {
              return (
                prop.type === "Property" &&
                prop.key.type === "Identifier" &&
                prop.key.name === "changeDetection" &&
                prop.value.type === "MemberExpression" &&
                (prop.value.property as TSESTree.Identifier).name === "OnPush"
              );
            });

            if (!hasOnPush) {
              // Report if OnPush is missing
              context.report({
                node,
                messageId: "missingOnPush",
                fix: (fixer) => {
                  const propertiesText = args.properties.map((prop) => context.getSourceCode().getText(prop)
                  );
                  const changeDetectionText = "changeDetection: ChangeDetectionStrategy.OnPush";
                  const newPropertiesText = propertiesText.length > 0
                    ? `${propertiesText.join(", ")}, ${changeDetectionText}`
                    : changeDetectionText;

                  return fixer.replaceText(
                    args,
                    `{ ${newPropertiesText} }`
                  );
                },
              });
            }
          }
        }
      },
    };
  },
  defaultOptions: []
};

export default enforceOnPush;
