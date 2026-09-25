import { IsNull, Not } from "typeorm";
import { AclCompany } from "./acl-company/acl-company.entity";
import { AclTemplate } from "./acl-template/acl-template.entity";
import { aclDataSource } from "./datasources";

export async function groupByNodes(csmNodes: string[]) {
    const csmNodesMap = Object.fromEntries(csmNodes.map((n) => [n, true]));

    const aclCompanyRepo = aclDataSource.getRepository(AclCompany)
    const aclTemplateRepo = aclDataSource.getRepository(AclTemplate)


    const templates = await aclTemplateRepo.find({
        where:{
            settings:Not(IsNull()),
            deletedAt:IsNull()
        },
        select:{
            id:true,
            name:true,
            settings:true
        }
    }
    );

    const templateCsmNode = Object.fromEntries(
        templates.map((t) => {
            //	    console.log({t})
            const csmNode = t?.settings.domains
                .find((d: any) => d.code === "PRODUCTS_URL")
                ?.endPoint?.replace("https://", "")
                .split(".")[0];

            return [t.id, csmNode];
        })
    );

    console.log(templateCsmNode);

    // const [aclCompanies] = await aclConnection.execute(
    //     "select id, nombre_comercial as name, code_company as code,template_id,ruc ,country_id from dp6_company where template_id is not null and deleted_at is null"
    // );
    const aclCompanies = await aclCompanyRepo.find({
        where:{
            templateId:Not(IsNull()),
            deletedAt:IsNull()
        },
        select:{
            id:true,
            name:true,
            code:true,
            templateId:true,
            ruc:true,
            countryId:true
        }
    })
    const groups: Record<
        string,
        {
            name?: string;
            id: number;
            code: string;
            templateId?: number;
        }[]
    > = {};

    aclCompanies.forEach(
        (c) => {
            if(!c.templateId) return
            const csmNode = templateCsmNode[c.templateId];
            if (!csmNodesMap[csmNode]) return;

            if (groups[csmNode]) {
                groups[csmNode].push({
                    ...c,
                    code: c.code.trim()
                });
            } else {
                groups[csmNode] = [
                    {
                        ...c,
                        code: c.code.trim()
                    },
                ];
            }
        }
    );
    return groups;
}