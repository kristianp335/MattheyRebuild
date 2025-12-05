package com.liferay.training.role.contributor;


import com.liferay.portal.kernel.audit.AuditRequestThreadLocal;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.Role;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.security.permission.contributor.RoleCollection;
import com.liferay.portal.kernel.security.permission.contributor.RoleContributor;
import com.liferay.portal.kernel.service.RoleLocalService;
import com.liferay.portal.kernel.service.UserLocalService;
import java.util.Collections;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

@Component(
    immediate = true,
    property = "service.ranking:Integer=100",
    service = RoleContributor.class
)
public class AddAdministratorRoleContributor implements RoleContributor {

    @Override
    public void contribute(RoleCollection roleCollection) {

        User user = roleCollection.getUser();
        System.out.println("Role contributor called");

        if (user != null) {
            System.out.println("Steps inside user != null check");
            try {
                Role adminRole = _roleLocalService.getRole(
                    user.getCompanyId(), "Administrator");
                    System.out.println(adminRole.getRoleId());
                Role addRoleTest = _roleLocalService.getRole(
                    user.getCompanyId(), "AddRoleTest");


                if (adminRole != null) {
                    System.out.println("Steps inside adminRole check");                    
                    roleCollection.addRoleId(adminRole.getRoleId());                    
                }

                if (addRoleTest != null) {
                    System.out.println("Steps inside addRoleTest check");                    
                    roleCollection.removeRoleId(addRoleTest.getRoleId());                    
                }
            }
            catch (Exception e) {
                _log.error("Error getting administrator role", e);
            }
        }
    }

    @Reference
    private RoleLocalService _roleLocalService;

    @Reference
    private UserLocalService _userLocalService;

    private static final Log _log = LogFactoryUtil.getLog(
        AddAdministratorRoleContributor.class);

}
